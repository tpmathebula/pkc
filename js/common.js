document.addEventListener('DOMContentLoaded', function() {
    // --- 1. Materialize Initialization ---
    // Initialize Sidenavs and other components
    const sideNavElems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(sideNavElems);

    // --- 2. PWA Installation Setup ---
    let deferredPrompt;
    const installContainer = document.querySelector('.install-container');
    const installButton = document.getElementById('install-button');
    const iosInstructions = document.querySelector('.ios-instructions');
    
    // Simple check to identify iOS devices (Safari/WebKit)
    const isIos = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    
    // Check if the app is already running in fullscreen (standalone) mode
    const isInStandaloneMode = () => (
        ('standalone' in window.navigator) && (window.navigator.standalone)
    ) || (
        window.matchMedia('(display-mode: standalone)').matches
    );

    // --- 3. Platform-Specific Logic ---
    
    // A. Logic for iOS (Manual Install)
    if (isIos && !isInStandaloneMode()) {
        // Hide the standard button container and show the instructions
        if (installContainer) {
            installContainer.style.display = 'none';
        }
        if (iosInstructions) {
            iosInstructions.style.display = 'block';
        }
    } 
    
    // B. Logic for Android/Desktop (Programmatic Install)
    else if (!isInStandaloneMode()) {
        // 1. Listen for the browser's install event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the browser's default prompt
            e.preventDefault(); 
            
            // Stash the event
            deferredPrompt = e;
            
            // Show the custom install button
            if (installContainer) {
                installContainer.style.display = 'block';
            }
        });

        // 2. Handle the button click
        if (installButton) {
            installButton.addEventListener('click', (e) => {
                // Hide the button and trigger the browser prompt
                installContainer.style.display = 'none';
                
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the A2HS prompt');
                        } else {
                            console.log('User dismissed the A2HS prompt');
                        }
                        deferredPrompt = null; // Clear the saved event
                    });
                }
            });
        }
    }
    
    // C. Optional: Log when the app is installed
    window.addEventListener('appinstalled', (e) => {
        console.log('PWA was successfully installed!');
        // Hide all installation prompts/buttons after installation
        if (installContainer) installContainer.style.display = 'none';
        if (iosInstructions) iosInstructions.style.display = 'none';
    });
});
