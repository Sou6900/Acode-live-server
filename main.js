"use strict";
(() => {
    let editorManager = window.editorManager;
    // let TotalUnsavedFiles = editorManager.hasUnsavedFiles();
    let settings = acode.require('settings');
    let SideButton = acode.require('sideButton');
    var jsonData = {}; //lets initiolize it empty well ad the things further
    const editorFile = acode.require('editorFile');
    //  acode.addIcon('full-screen', 'https://ibb.co/knfL8D9');

    let oldSetting = settings.get('autosave') /// needs menimum valur 1000 mili seconds
    var e = {
        "id": "liveserver",
    }

    class LiveServer {
        constructor() {
            this.port = null;
            this.isBigScreenEnabled = false;
            this.isServerOnline = false;
        }

        async init() {
            //console.log("LiveServerPlugin initialized!");
            acode.addIcon('liveserver', `${this.baseUrl}icon.png`);
            this.reloadFile = () => {
                try {
                    let iframe = document.getElementById('iframe');
                    if (iframe) {
                        iframe.src = `http://localhost:${jsonData.port}/${jsonData.fileName}`;
                    }
                    try {
                        let tab = editorManager.getFile(e.id, 'id')
                        //console.log(tab)
                        if (tab) {
                            tab.content.shadowRoot.querySelector(`#iframe22`).src = `http://localhost:${jsonData.port}/${jsonData.fileName}`;
                        }
                    }catch (err) {
                        //console.log("tab not found ", err)
                    }

                } catch (err) {
                    //  console.log(`Live server error ${err}`);
                }
            }
            ////////////////////////////////////
            //// design the big screen page/////
            ////////////////////////////////////
            let BigScreenContent = document.createElement('div');
                BigScreenContent.style.cssText = `
                height:100%;
                display:flex;
                flex-direction:column;
                `;
            let top_bar = document.createElement('nav');
                top_bar.style.cssText = `height: 6%; width:96%; margin-right:auto; margin-left:auto; margin-top:3px; margin-bottom:4px; background-color:gray; position:stiky; display:flex; flex-direction:row; justify-content:space-between; border-radius:10px; border:none; padding:0px 5px`;
    
                let title_container = document.createElement('span');
                    title_container.style.cssText = 'margin-top:auto; margin-bottom:auto; margin-left:5px;'
                    let title = document.createElement('p')
                    title.style.cssText = 'font-size:22px; font-weight:700;'
                    title.innerText = 'Dev Tools';
                    title_container.appendChild(title);
                    top_bar.appendChild(title_container);
        
                let tools_container = document.createElement('span');
                    tools_container.style.cssText = 'display:flex; flex-direction:row; column-gap:10px; margin-top:auto; margin-bottom:auto; margin-right:6px;';
                    let tool1 = document.createElement('p');
                        tool1.innerText = 'Console';
                        tool1.style.cssText = 'font-weight:500;'
                        tool1.onclick = () => {window.toast('comming soon')}
                        
                    let tool2 = document.createElement('p');
                        tool2.innerText = 'Share';
                        tool2.style.cssText = 'font-weight:500;';
                        tool2.onclick = () => {window.toast('comming soon')}
                        
                    let tool3 = document.createElement('p');
                        tool3.innerText = 'Open in Browser';
                        tool3.style.cssText = 'font-weight:500;'
                        tool3.onclick = () => {window.toast('comming soon')}
        
                    tools_container.appendChild(tool1);
                    tools_container.appendChild(tool2);
                    tools_container.appendChild(tool3);
                top_bar.appendChild(tools_container);
                
            var iframe22 = document.createElement('iframe');
                iframe22.className = 'iframe22';
                iframe22.id = 'iframe22';
                iframe22.style.cssText = `
                flex-grow:1;
                `;
            BigScreenContent.appendChild(top_bar);
            BigScreenContent.appendChild(iframe22);
            this.BigScreenContent = BigScreenContent;
            this.openWindow = () => {
                if (!document.getElementById("live-server-window")) {
                    showWindow();
                }
            }
            this.liveServerButton = SideButton(
                {
                    text: 'Live Server',
                    icon: 'warningreport_problem',
                    onclick: this.openWindow,
                    backgroundColor: 'red',
                    textColor: '#000',
                }
            );
            this.showOrHideIFhtml = () => {
                if (isHTMLFile()) {
                    if (this.liveServerButton) {
                        this.liveServerButton.show();
                    }
                } else if (this.liveServerButton) {
                    this.liveServerButton.hide();
                }
            }
            this.showOrHideIFhtml();

            ///////////////////////////////////////////////////////////////////
            ///INITILIZING ALL EVENT Listeners///////
            editorManager.on('save-file', () => {
                ///i have to move it to an seprate function so that it will only listen when its actually needed its efficient use of resources
                ///ill update it later its forcing the windo to relode
                this.reloadFile();
            });

            editorManager.on('switch-file', () => {
                this.showOrHideIFhtml();
            });
            var iframe2 = document.createElement('iframe');
                iframe2.className = "iframe";
                iframe2.id = "iframe2";
                iframe2.style.cssText = `
                top:0px;
                right:0px;
                left:0px;
                bottom:0px
                border:5px solid green;
                `;

            //////////////////////////////////////////////////////////
            ///coading for UI or frontend
            async function start_in_app_server(basePath, Active_file_id) {
                const terminal = await acode.require('terminal');
                const server = await terminal.createServer();
                // wait for terminal start up
                await new Promise((resolve)=> {
                    setTimeout(resolve, 1000)})
                // nowg exes ute ckmmands
                //let command = `chmod -R 777 '/'\n\n\n`;
                let command = "if [ -d 'Acode-live-server-backend' ]; then\n";
                command += "  cd Acode-live-server-backend && python3 main.py\n";
                command += "else\n";
                command += "  apk update\n";
                command += "  apk upgrade\n";
                command += "  apk add git\n";
                command += "  apk add python3\n";
                command += "  apk add py3-pip\n";
                command += "  git clone https://github.com/hackesofice/Acode-live-server-backend.git\n";
                command += "  cd Acode-live-server-backend\n";
                command += "  apk add --no-cache py3-flask py3-requests py3-flask-cors py3-jinja2";
                command += "  python3 main.py\n";
                command += "fi\n";
                terminal.write(server.id, command)

                // re open that tab
                //console.log(typeof(Active_file_id))
                await new Promise((resolve)=> {setTimeout(resolve, 4000)})
                editorManager.switchFile(Active_file_id)
            }


            async function showWindow() {
                settings.update({
                    autosave: 1000
                });
                if (!document.body) {
                    console.error("document.body is not available!");
                    return;
                }

                ////// button for hiding and showing
                let iframe = document.createElement('iframe');
                    iframe.id = 'iframe';
                    iframe.className = 'iframe';
                    iframe.style.cssText = `
                    right:0;
                    left:0;
                    bottom:0;
                    border: 1px solid black;
                    height: 100%;
                    width: 100%;
                    box-shadow: 0px 0px 10px rgba(0.0.0.0.50);
                    `;
                //)//////////////////////////////////////////////////////
                document.getElementById("live-server-window")?.remove();
                let windowDiv = document.createElement('div');
                    windowDiv.id = "live-server-window";
                    windowDiv.style.cssText = `
                    position: fixed !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    right:0; !important;
                    width: 100% !important;
                    max-width:100% !important;
                    height: 40vh !important;
                    background: white !important;
                    border-top: 2px solid black !important;
                    box-shadow: 0px -4px 10px rgba(0, 0, 0, 0.5) !important;
                    z-index: 90 !important;
                    overflow: hidden !important;
                    transition: height 0.1s ease !important;
                    `;

                // Create Title Bar
                let titleBar = document.createElement('div');
                    titleBar.innerText = "Live Server Window";
                    titleBar.style.cssText = `
                    width: 100%;
                    height: 40px;
                    background: #222;
                    color: white;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 10px;
                    cursor: ns-resize;
                    user-select: none;
                    touch-action: none;
                    `;
                
                // Close Button
                let closeButton = document.createElement('button');
                    closeButton.id = 'closeButton';
                    closeButton.innerText = "×";
                    closeButton.onclick = shutDownLiveServer;
                    closeButton.style.cssText = `
                    right:20px;
                    background: red;
                    color: white;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    `;
                ///,minimze button
                let minimizeButton = document.createElement('button');
                    minimizeButton.innerText = '➖';
                    minimizeButton.onclick = hideTheWindow;
                    minimizeButton.style.cssText = `
                    margin-right:0;
                    `;

                let maxFullScreen = document.createElement('button');
                    maxFullScreen.className = 'icon googlechrome';
                    maxFullScreen.id = 'maxFullScreen';
                    maxFullScreen.onclick = () => {
                        iframe.src ? addBigScreenPage(iframe.src, iframe): window.toast('dissabled ! start server first')};
                    maxFullScreen.style = `
                    margin-right: 10px;
                    `

                // Horizomtal rule
                let hrTag = document.createElement('hr');
                    hrTag.style.cssText = `
                    border: 1px solid black;
                    margin-top: 2px;
                    `;

                ///div for holding the iframe
                let main_screen = document.createElement('div');
                    main_screen.style.cssText = `
                    bottom: 0;
                    top: 10px;
                    border: 1px solid black;
                    height: 100%;
                    width: 100%;
                    `;

                ///close the serve(clint)
                function shutDownLiveServer() {
                    //  console.log("Closing live server window...");
                    windowDiv.remove();
                    editorManager.off('save-file', this.reloadFile);
                    titleBar.removeEventListener("mousedown", startResize);
                    titleBar.removeEventListener("touchstart", startResize);
                    window.removeEventListener("mousemove", performResize);
                    window.removeEventListener("touchmove", performResize);
                    window.removeEventListener("mouseup", stopResize);
                    window.removeEventListener("touchend", stopResize);
                    settings.update({
                        autosave: oldSetting
                    });

                };

                // Resizing Logic for Touch & Mouse
                let isResizing = false;
                let startY,
                startHeight;

                function startResize(event) {
                    // console.log("Resizing started!");
                    isResizing = true;
                    let touch = event.touches ? event.touches[0]: event;
                    startY = touch.clientY;
                    startHeight = windowDiv.offsetHeight;
                    document.body.style.userSelect = "none";
                }

                function performResize(event) {
                    if (!isResizing) return;
                    let touch = event.touches ? event.touches[0]: event;
                    let newHeight = startHeight + (startY - touch.clientY);
                    // console.log("New Height:", newHeight);
                    if (newHeight >= 100 && newHeight <= window.innerHeight * 0.9) {
                        windowDiv.style.height = `${newHeight}px`;
                    }
                }

                function stopResize() {
                    /// console.log("Resizing stopped!");
                    isResizing = false;
                    document.body.style.userSelect = "auto";
                }

                // Attach Both Mouse & Touch Listeners
                titleBar.addEventListener("mousedown", startResize);
                titleBar.addEventListener("touchstart", startResize);
                window.addEventListener("mousemove", performResize);
                window.addEventListener("touchmove", performResize);
                window.addEventListener("mouseup", stopResize);
                window.addEventListener("touchend", stopResize);

                // Append im ui
                titleBar.appendChild(minimizeButton);
                titleBar.appendChild(closeButton);
                titleBar.appendChild(maxFullScreen); // now we will add it if the server is connected
                windowDiv.appendChild(titleBar);
                windowDiv.appendChild(hrTag);
                // windowDiv.appendChild(iframe);
                main_screen.appendChild(iframe);
                windowDiv.appendChild(main_screen);
                document.body.appendChild(windowDiv);
                //document.body.appendChild(maximizeButton);
                //console.log("Live Server Window added!");
                handleTheBackend();
            }// endimg of open window function




            ///// now start the backend such as defining the differebt typws of variables like getting the file name etc and before UI loading prepare for it like connection with the server etc
            /////// copied this logic from acodex terminal (,by bajrang coarder)
            function resolvePath(rawPath) {
                //console.log(rawPath)
                // alert(baseUrl);
                if (rawPath.startsWith("content://com.termux.documents/tree")) {
                    const path = rawPath.split("::")[1];
                    const trimmed = path.substring(0, path.lastIndexOf("/"));
                    return trimmed.replace(/^\/data\/data\/com\.termux\/files\/home/, "$HOME");
                }
                if (rawPath.startsWith("file:///storage/emulated/0/")) {
                    const trimmed = rawPath.substr(26).replace(/\.[^/.]+$/, "");
                    const directory = trimmed.split("/").slice(0, -1).join("/");
                    return `/sdcard${directory}/`;
                }
                if (rawPath.startsWith("content://com.android.externalstorage.documents/tree/primary")) {
                    const trimmed = rawPath.split("::primary:")[1];
                    const directory = trimmed.substring(0, trimmed.lastIndexOf("/"));
                    return `/sdcard/${directory}`;
                }
                if (rawPath.startsWith("file:///data/user/0/com.foxdebug.acode/files/alpine/home/")){
                    const prefix = "file:///data/user/0/com.foxdebug.acode/files/alpine/home"
                    const trimmed = rawPath.slice(prefix.length)
                    const directory = trimmed.substring(0, trimmed.lastIndexOf("/"));
                    return `..${directory}`
                }
                return false;
            }


            ////////It returns tye json data object which contains
            //////// 1 file url and file name
            async function handleTheBackend() {
                let rawPath = null;
                let savedFilePath = null;
                let cacheFilePath = null;
                let ActiveFile = null;
                let Active_file_id = null;
                ActiveFile = editorManager.activeFile; //returns the object
                //ActiveFileType = editorManager.activeFile.session.$modeId; //returns the file type like its a javaacript or html or something
                savedFilePath = ActiveFile.uri; //the ActiveFile is instance of inbuilt editorManager API
                cacheFilePath = ActiveFile.cacheFile;
                Active_file_id = ActiveFile.id;
                //console.log(ActiveFile)
                if (!savedFilePath && !cacheFilePath) {
                    //  console.log(' saved path or cacheFilePath noy found')
                    return;
                } else {
                    rawPath = savedFilePath || cacheFilePath; //it will assign a value whis is avilable
                    if (savedFilePath) {
                        const rawFilePath = rawPath;
                        const fileName = rawFilePath.split('/').pop();

                        const originalPath = resolvePath(rawPath);
                        //console.log(originalPath)
                        // console.log(originalPath.split('/')[1][2])
                        if (!originalPath) {
                            return;
                        } else {
                            jsonData.path = originalPath;
                            jsonData.fileName = fileName;
                            if (!jsonData.port) {
                                (async () => {
                                    let livePort;
                                    livePort = await getLivePortIfAvilable();
                                    //console.log(livePort)
                                    if (livePort) {
                                        //console.log(`live port gotten its ${livePort}`)
                                        jsonData.port = livePort;
                                        //console.log(jsonData)
                                        if (!checkServer(jsonData, handleTheBackend)) {
                                            delete jsonData.livePort
                                            handleTheBackend();
                                        }
                                    } else {
                                        //console.log('port not found showing default window')
                                        showDefaultWindow();
                                        // console.log(([originalPath.split('/')[1], originalPath.split('/')[2]].join("/")))
                                        if (window.BuildInfo.versionCode >= 963) {
                                            const btn = document.getElementById('closeButton');
                                            btn?.click();
                                            await start_in_app_server([originalPath.split('/')[1], originalPath.split('/')[2]].join("/"), Active_file_id);
                                            window.alert(" please run again ")
                                        }
                                    }
                                })();
                            } else {
                                if (!checkServer(jsonData, handleTheBackend)) {
                                    delete jsonData.livePort
                                    //   console.log('recalling ')
                                    handleTheBackend();
                                }
                            }
                        }
                    } else if (cacheFilePath) {
                        alert('the file you wanna run its unsaved file please save it')
                        const btn = document.getElementById('closeButton');
                        btn?.click();
                        return;
                    }
                }

            }


            function hideTheWindow() {
                //////////Hide the window
                document.getElementById('live-server-window').style.display = 'none';
                //    current_display.style.display = current_display.style.display = 'none' ? 'none' : 'block';
                let btn = document.getElementById('maximizeButton');
                if (!btn) {
                    let maximizeButton = document.createElement('button');
                    maximizeButton.id = 'maximizeButton';
                    maximizeButton.onclick = showTheWindow;
                    maximizeButton.innerText = 'LIVE';
                    maximizeButton.style.cssText = `
                    height: 35px !important;
                    width: 35px !important;
                    border: 2px solid black !important;
                    border-radius: 5px !important;
                    position: absolute !important;
                    left: 10px !important;
                    bottom: 50% !important;
                    z-index: 10000 !important;
                    color: black;
                    background-color: red !important; /* Changed for visibility */
                    `;
                    document.body.appendChild(maximizeButton);
                } else {
                    btn.style.display = 'block';
                }
            }


            ///because of thisfunction called by thr maximize button to thers no chance to be undefined
            function showTheWindow() {
                document.getElementById('live-server-window').style.display = 'block';
                document.getElementById('maximizeButton').style.display = 'none';
            }


            function isHTMLFile() {
                // console.log(editorManager);
                if (
                    editorManager &&
                    editorManager.activeFile &&
                    editorManager.activeFile.session &&
                    editorManager.activeFile.session.$modeId
                ) {
                    // console.log('inside if html file function and session is tfuthy')
                    const ActiveFileType = editorManager.activeFile.session.$modeId;
                    if (ActiveFileType) {
                        return ActiveFileType === 'ace/mode/html';
                    }
                } else {
                    //   console.log('inside if html file function and session is falsy')
                    return false;
                }
            }

            async function checkServer(jsonData, handleTheBackend) {
                //console.clear();
                let jsonDataDuplicate = jsonData;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds
                //   console.log('check server function triggerd')
                try {
                    // await new Promise((resolve, reject)=>{
                    //     window.cordova.plugin.http.patch(`http://localhost:${jsonData.port}/setup`, JSON.stringify(jsonData), {'Content-Type': 'application/json'}, (resolve)=>{resolve}, (reject)=>{reject})
                    // })
                  //  await check_this_port(jsonData.port, 5000, data=JSON.stringify(jsonData))
                    //console.log(jsonDataDuplicate)
                    let response = undefined;
                    response = await fetch(`http://localhost:${jsonData.port}/setup`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonData),
                        signal: controller.signal
                    });
                    // console.log(response)
                    //console.log(await response.json())
                    clearTimeout(timeoutId);
                    if (!response || !response.ok) {
                        //console.log('unable to connect server');
                        //throw new Error(`Server error: ${response.status}`);
                        return false;
                    }
                        const data = await response.json();
                        //console.log(data);
                    setTimeout(() => {
                        let iframe = document.getElementById('iframe');
                        if (iframe) {
                            iframe.src = `http://localhost:${jsonData.port}/`;
                        }
                    },1000);
                    return true
                } catch (error) {
                    if (error.name === 'AbortError') {
                        // console.error('Fetch request timed out');
                    } else {
                        delete jsonData.port
                        handleTheBackend()
                        //  editorManager.switchFile("id")
                        console.error('Live server not reachable:', error.message);
                    }
                    showDefaultWindow()
                    //console.log('rerurning false')
                    return false
                }
            }
            
            // function make_check_request(port)

            function showDefaultWindow() {
                //console.log(navigator.onLine)
                const iframes = document.querySelectorAll('iframe.iframe');
                //    console.log(iframes)
                if (iframes.length > 0) {
                    let i = -1;
                    while (i < iframes.length) {
                        const default_content = `
                        <body>
                        <h1> server status = off </h1>
                        <h1> Phone Network status = off </h1>

                        </body>
                        `;
                        // console.log(iframes)
                        try {
                            // returns true/false based on data connection
                            if (navigator.onLine) {
                                let iframe = document.getElementById('iframe');
                                if (iframe) {
                                    iframe.src = 'https://acode-live-server-documentations.vercel.app/';
                                }
                                if (iframe22) {
                                    iframe22.src = 'https://acode-live-server-documentations.vercel.app/';
                                } else {
                                    console.warn("can not able to find the iframe22");
                                }
                            } else {
                                let iframe = document.getElementById('iframe');
                                if (iframe) {
                                    //console.log(" getting content window ")
                                    iframe.contentWindow.document.body.innerHTML = default_content;
                                    setTimeout(() => {
                                        const btn = document.getElementById('closeButton')
                                        const miniRedLiveButton = document.getElementById('maximizeButton')

                                        //Remove the red live button before removing thr resizable window
                                        if (miniRedLiveButton) {
                                            miniRedLiveButton.style.display = 'none'
                                        }
                                        if (btn) {
                                            btn.click()
                                        }

                                    },
                                        10000);
                                }
                                if (iframe22) {
                                    iframe22.contentWindow.document.body.innerHTML = default_content;
                                } else {
                                    //console.log("iframe22 doesnt exists");
                                }

                            }

                        } catch (error) {
                            console.error(`erro gotten ${error}`)
                        }
                        i++;
                    }
                } else {
                    console.error('cant find any iframe');
                }
            }
            
            async function getLivePortIfAvilable(timeout = 1000) {
                let portList = [1024,
                    1025,
                    1026,
                    1027,
                    1028,
                    1029,
                    1030,
                    1031,
                    1032,
                    1033,
                    1034];
                for (let port of portList) {
                    let running_port;
                    try{
                        running_port = await check_this_port(port, timeout)
                        // console.log("request sucessful ",running_port)
                        return port
                    }catch(err){
                        //console.log('bot running ', err)
                    }
                  // console.log()
                    // if (working_port){
                    //     return working_port
                    // }
                    
                    
                    
                    // const controller = new AbortController();
                    // const signal = controller.signal;

                    // // Set a timeout to abort the fetch
                    // const timer = setTimeout(() => {
                    //     controller.abort();
                    // }, timeout);

                    // try {
                    //     const response = await fetch(`http://localhost:${port}/check`, {
                    //         method: 'GET',
                    //         signal: signal
                    //     });
                    //     clearTimeout(timer);

                    //     if (response.ok) {
                    //         return port;
                    //     }
                    // } catch (err) {
                    //     clearTimeout(timer);
                    //     //        console.log(`Port ${port} failed or timed out:`, err.message);
                    //     //   console.clear()
                    // }
                }
                return null;
            }
            
            function check_this_port(port, timeout, data={}){
               return new Promise((resolve, reject)=>{
                     cordova.plugin.http.get(`http://localhost:${port}/check`, data, {}, (port)=>{resolve(port)}, (port)=>{reject(port)})
                    setTimeout(() =>{reject(port)}, timeout)
                });
            }


            ////////////////////))/))////ll/)//////////////
            // COADING FOR BIG SCREEN
            function addBigScreenPage(content_link, resizable_screen) {
                if (editorManager.getFile(e.id, 'id')) {
                    return
                }

                // if (!this.reloadBigScreen){
                //     this.reloadBigScreen = (() => {
                //         const iframe3 = BigScreenContent.querySelector("#iframe22");
                //         if (this.isServerOnline){
                //             iframe3.src = `http://localhost:${jsonData.port}`;
                //         }else {
                //             iframe3.contentWindow.document.body.innerHTML = `
                //                     hello brother server is off
                //                 `;
                //         }
                //     });
                // }
                // console.log(content_link)
                if (content_link) {
                    BigScreenContent.querySelector('#iframe22').src = content_link;
                } else {
                    BigScreenContent.querySelector('#iframe22').innerHTML = resizable_screen.contentWindow.document.body.innerHTML
                }
                const bigScreen = new editorFile('Live Server', {
                    type: 'page',
                    render: true,
                    content: BigScreenContent,
                    tabIcon: "icon liveserver",
                    id: e.id,
                    hideQuickTools: true,
                    uri: ' '
                });

            }

        }// cloasing of init functio9n

        async destroy() {
            document.getElementById('live-server-window')?.remove();
            if (this.liveServerButton) {
                this.liveServerButton.hide();
                this.liveServerButton = undefined;
            }
            if (this.reloadFile) {
                editorManager.off('save-file', this.reloadFile);
            } else {
                console.warn('this.reloadFileisnt defined');
            }
            if (this.showOrHideIFhtml) {
                editorManager.off('switch-file', this.showOrHideIFhtml);
            } else {
                console.warn('this.showOrHideIFhtml not defined')
            }
            document.getElementById('maximizeButton')?.remove();
            if (settings) {
                settings.update({
                    autosave: oldSetting
                });
            }
            if (this.reloadBigScreen) {
                editorManager.off("save-file", this.reloadBigScreen);
            }
            if (this.bigScreen) {
                this.bigScreen.remove(true);
            }
        }
    }//and her is the AcodePlugin class ends


    if (window.acode) {
        // console.log('inside acode window');
        let i = new LiveServer();
        //  console.log('cr3ated i instance');
        acode.setPluginInit(e.id, async (n, o, {
            cacheFileUrl: s, cacheFile: d
        }) => {
            n.endsWith("/") || (n += "/");
            i.baseUrl = n;
            //  console.log('runnig the init Function');
            await i.init(o, d, s);
        });


        acode.setPluginUnmount(e.id, () => {
            i.destroy();
        });
    }
})();