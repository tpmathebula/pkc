document.addEventListener('DOMContentLoaded', function() {
    // Initialize Materialize components (Sidenav, etc.)
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems);

    // --- PWA Installation Logic ---
    let deferredPrompt;
    const installContainer = document.querySelector('.install-container');
    const installButton = document.getElementById('install-button');

    // 1. Save the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the default browser prompt from showing automatically
        e.preventDefault(); 
        
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        
        // 2. Show the custom install button
        if (installContainer) {
            installContainer.style.display = 'block';
        }
    });

    // 3. Handle the button click
    if (installButton) {
        installButton.addEventListener('click', (e) => {
            // Hide the button immediately
            installContainer.style.display = 'none';
            
            // Show the install prompt saved earlier
            if (deferredPrompt) {
                deferredPrompt.prompt();
                
                // Wait for the user to respond to the prompt
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

    // Optional: Log when the app is actually installed
    window.addEventListener('appinstalled', (e) => {
        console.log('PWA was successfully installed!');
    });
});
