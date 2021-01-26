import { app } from "electron";
import url from "url";
import path from "path";
import { createWindow } from "./utils/windows";

// Gardez une reference global de l'objet window, si vous ne le faites pas, la fenetre sera
// fermee automatiquement quand l'objet Javascript sera garbage collected
let win;

function startup() {
  // Créer le browser window.
  win = createWindow("mainWindow", {
    width: 1024,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: true
  });

  // and load the index.html of the app
  let opts = {
    pathname: path.join(__dirname, "..", "renderer", "index.html")
  };
  let index = url.format(opts);
  win.loadFile(index);

  //if (process.env.NODE_ENV === 'dev')
  /* win.openDevTools(); */

  // Émit lorsque la fenêtre est fermée.
  win.on("closed", () => {
    // Dé-référence l'objet window , normalement, vous stockeriez les fenêtres
    // dans un tableau si votre application supporte le multi-fenêtre. C'est le moment
    // où vous devez supprimer l'élément correspondant.
    win = null;
  });
}

// Cette méthode sera appelée quant Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quand cet événement est émit.
app.on("ready", startup);

// Quitte l'application quand toutes les fenêtres sont fermées.
app.on("window-all-closed", () => {
  // Sur macOS, il est commun pour une application et leur barre de menu
  // de rester active tant que l'utilisateur ne quitte pas explicitement avec Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});
