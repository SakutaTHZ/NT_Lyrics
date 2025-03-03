console.log("Transition Loading");

if ("navigation" in window && navigation.addEventListener) {
    navigation.addEventListener("navigate", (event) => {
        if (!event.destination.url.includes(document.location.origin)) {
            return;
        }

        event.intercept({
            handler: async () => {
                const response = await fetch(event.destination.url);
                const text = await response.text();

                // Extract title
                const titleMatch = text.match(/<title[^>]*>([\s\S]*)<\/title>/i);
                const newTitle = titleMatch ? titleMatch[1] : document.title;

                // Extract the new page's content inside a container
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = text;

                // Ensure there's a wrapper for transition (adjust #main-content as needed)
                const newMain = tempDiv.querySelector("#root");
                const oldMain = document.querySelector("#root");

                if (!newMain || !oldMain) {
                    console.error("Main content area not found!");
                    return;
                }

                if (document.startViewTransition) {
                    const transition = document.startViewTransition(() => {
                        oldMain.replaceWith(newMain);
                        document.title = newTitle;
                    });

                    transition.ready.then(() => {
                        window.scrollTo(0, 0);
                    });
                } else {
                    // Fallback for browsers without view transitions
                    oldMain.replaceWith(newMain);
                    document.title = newTitle;
                    window.scrollTo(0, 0);
                }
            },
            scroll: "manual",
        });
    });
}
