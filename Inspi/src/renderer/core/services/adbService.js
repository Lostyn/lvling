import { spawn } from "child_process";
import path from "path";
import adb from 'adbkit';
import PQueue from 'p-queue';
import store from '../../store';
import { setDevices } from '../../store/actions/DeviceActionsCreators';
import manifestManager from '../manifestManager';

const MODELS = {
    PicoG2: 'Pico G2',
    PicoG2_4K: 'Pico G2 4K',
    Oculus_GO: 'Pacific' 
}
/**
 * Kiosk mode
 * G2 4k --> setprop persist.pxr.force.home app_id,activity_id
 * G2 --> persist.pvr.default.home --> app_id
 * Oculus GO --> [ro.ovr.home_uri]: [com.oculus.vrshell.home/com.oculus.vrshell.home.MainActivity] ???
 */
const APP_ID = "com.hyperfiction.kiosk360,com.unity3d.player.UnityPlayerNativeActivityPico";
const ADBPATH = () => {
    if (process.env.NODE_ENV != "dev")
        return path.join(process.resourcesPath, "extraResources/adb.exe");
    
    return path.resolve(__dirname, "../../../extraResources/adb.exe");
}
export class ADBService {
    constructor(dispatch) {
        this.dispatch = dispatch;
        this.devices = [];

        var adbBinPath = ADBPATH();
        console.log(adbBinPath);

        this.client = adb.createClient({ 
            bin: adbBinPath
        });

        this.observeDevices();
    }

    /**
     * Observe device connect and disconnect
     */
    observeDevices() {
        this.client.trackDevices()
            .then( tracker => {
                tracker.on('add', this.onDeviceAdded);
                tracker.on('remove', this.onDeviceRemoved);
                tracker.on('end', () => console.warn('ADB device tracking stopped'))
            })
            .catch( err => console.warn(`Unable to observe devices: ${err}`));
    }

    onDeviceAdded = adbKitDevice => {
        this.devices.push(adbKitDevice.id);
        store.dispatch(setDevices(this.devices));
    }

    onDeviceRemoved = adbKitDevice => {
        const index = this.devices.indexOf(adbKitDevice.id);
        if (index > -1) {
            this.devices.splice(index, 1);
            store.dispatch(setDevices(this.devices));
        }
    }

    async uninstallAllDevices({
        onProgress = null,
        onDeviceProcessStart = null
    } = {}) {
        let globalProgress = 0;
        
        onProgress(0);
        for(let deviceId of devices) {
            onDeviceProcessStart(deviceId);
            await this._uninstallAdbDevice(deviceId, LAUNCHER_APK_NAME);
            
            globalProgress++;
            onProgress(globalProgress / this.devices.length);
        }
    }

    async installAllDevices({
        options,
        onProgress = null,
        onItemProgress = null,
        onProgressMessage = null,
        onDeviceProgress = null,
        onSpaceRemaining = null,
        onDeviceProcessStart = null
    } = {}) {
        let deviceProgress = 0;
        let globalProgress = 0;

        const manifestFile = await manifestManager.createManifestFile();
        const devices = this.devices;

        for(let deviceId of devices) {
            onDeviceProcessStart(deviceId);
            await this.processDevice(
                options,
                deviceId,
                manifestFile,
                (itemProgress) => {
                    globalProgress += itemProgress;
                    onProgress(globalProgress / devices.length);
                },
                onItemProgress,
                onProgressMessage,
                onSpaceRemaining
            )
            deviceProgress++;
            onDeviceProgress(deviceProgress);
        }
    }

    async processDevice(
        options,
        id,
        manifestFile,
        onProgress,
        onItemProgress,
        onProgressMessageCallback,
        onSpaceRemaining
    ) {
        if (options.settings.advanced.clearOldFiles) {
            onProgressMessageCallback('Suppression des fichiers existants');
            try {
                await this._removeAllFiles(id);
                console.log('cleared all files', id);
            } catch (e) { console.log(e);}
        }

        onProgress(0.25);

        try {
            onProgressMessageCallback('Création du dossier HFDatas');
            await this._createDirectory(id, 'HFDatas/360');
            console.log(`Created HFDatas/360 directory on ${id}`);
        } catch (e) {
            console.log(`HFDatas/360 already exist on ${id}`);
        }

        onProgress(0.25);

        onSpaceRemaining(await this._getDeviceSpaceRemaining(id));

        if (options.settings.base.copyContents) {
            if (options.settings.advanced.copyFiles) {
                onProgressMessageCallback('Copie des fichiers');
                await this._pushAllFiles(id, options.files, onItemProgress, onProgressMessageCallback);
                console.log(`New content pushed on device ${id}`);
            }

            if (options.settings.advanced.copyJson) {
                onProgressMessageCallback('Copie du manifest');
                await this._pushManifest(id, {
                        from: manifestFile,
                        to: '/storage/emulated/0/HFDatas/360/manifest.json'
                    },
                    onItemProgress
                );
                console.log(`Manifest pushed on device ${id}`);
            }
        }

        onProgress(0.25);

        if (options.settings.base.installApk) {
            onProgressMessageCallback(`installation de l'apk sur ${id}`);
            await this._installAdbDevice(id, options.paths);
            console.log(`Apk installed on device ${id}`);
        }

        onProgress(0.25);
    }

    async setKioskMode() {
        for(let deviceId of this.devices) {
            var model = await this._getDeviceModel(deviceId);
            // Only Pico G2 4K kiosk mode supported for now
            if (model == MODELS.PicoG2_4K) {
                await this._runShellCommand(deviceId, `setprop persist.pxr.force.home ${APP_ID}`);
            }
        }
    }

    async removeKioskMode() {
        for(let deviceId of this.devices) {
            var model = await this._getDeviceModel(deviceId);
            // Only Pico G2 4K kiosk mode supportedo for now
            if (model == MODELS.PicoG2_4K) {
                await this._runShellCommand(deviceId, `setprop persist.pxr.force.home ''`);
            }
        }
    }


    _removeAllFiles = (id) => {
        return new Promise((resolve, reject) => {
            this._runShellCommand(id, `rm -rf /storage/emulated/0/HFDatas/360/*`)
                .then( resolve )
                .catch( reject );
        });
    }

    _createDirectory = (id, dir) => {
        return new Promise((resolve, reject) => {
            this._runShellCommand(id, `mkdir /storage/emulated/0/${dir}`)
                .then( resolve )
                .catch( reject );
        });
    }

    _getDeviceSpaceRemaining = (id) => {
        return new Promise((resolve, reject) => {
            this._runShellCommand(id, `df -h /storage/emulated`)
                .then( output => output.split('\n')[1].split(/\s+/)[3] )
                .then( resolve )
                .catch( err => {
                    console.error(err);
                    reject();
                } );
        });
    }

    _pushAllFiles(id, files, onProgress, onProgressMessageCallback) {
        const queue = new PQueue({concurrency: 1});
        for(let file of files) {
            queue.add( () => this._pushContent(id, file, onProgress, onProgressMessageCallback));
        }
        return queue.onIdle();
    }

    _pushContent = (id, file, onProgress, onProgressMessageCallback) => {
        return new Promise((resolve, reject) => {
            onProgressMessageCallback(`Copie du fichier ${file.to}`);
            this._spawnCopyCommand(id, file.from, file.to, onProgress )
                .then( resolve )
                .catch( err => {
                    console.error(err);
                    reject();
                });
        });
    }

    _pushManifest = (id, file, onProgress) => {
        return new Promise((resolve, reject) => {
            this._spawnCopyCommand(id, file.from, file.to, onProgress)
                .then( resolve )
                .catch( err => {
                    console.error(err);
                    reject();
                })
        })
    }

    _uninstallAdbDevice(id, packageName) {
        return new Promise((resolve, reject) => {
            this.client.uninstall(id, packageName)
                .then( resolve )
                .catch( err => {
                    console.error(err);
                    reject(err);
                })
        });
    }

    async _installAdbDevice(id, paths) {
        var model = await this._getDeviceModel(id);
        var pathForModel = this.GetGoodPath(paths, model);
        
        return new Promise((resolve, reject) => {
            this.client.install(id, pathForModel)
                .then( resolve )
                .catch( err => {
                    console.error(err);
                    reject(err);
                })
        });
    }

    GetGoodPath(paths, model) {
        if (model == MODELS.Oculus_GO) return paths.go;
        else return paths.pico;
    }

    _getDeviceModel(id) {
        return new Promise((resolve, reject) => {
            this._runShellCommand(id, `getprop ro.product.model`)
                .then(resolve)
                .catch( err => {
                    console.error(err);
                    reject(err);
                });
        })
    }


    _runShellCommand = (deviceId, command) => {
        //console.log(`Executing shell command on ${deviceId}: ${command}`);
        return new Promise((resolve, reject) => {
            this.client.shell(deviceId, command)
                .then( adb.util.readAll)
                .then( outputBuffer => {
                    let output = outputBuffer.toString('utf-8');
                    output = output.replace(/^\s+|\s+$/g, '');
                    resolve(output);
                })
                .catch( err => {
                    console.error(err);
                    reject()
                });
        });
    }

    _spawnCopyCommand = (deviceId, from, to, update) => {
        return new Promise((resolve, reject) => {
            var lastProgress = 0;
            update(0);

            var child = spawn(ADBPATH(), ["-s", deviceId, "push", from, to]);

            child.stdout.on('data', data => {
                var line = data.toString().split('\n')[0];
                var progress = parseInt(line.substring(1, 4));
                if (!isNaN(progress)) {
                if (progress != lastProgress) {
                    update(progress);
                    lastProgress = progress;
                }
                }
            });

            child.stderr.on('data', reject)
            child.on('close', resolve )
        })
    }
}