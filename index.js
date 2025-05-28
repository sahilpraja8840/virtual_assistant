let box = document.querySelector(".box");
let btn = document.querySelector("button");


const speakFun = (input) => {
    let speakInput = new SpeechSynthesisUtterance(input);
    speakInput.pitch = 1;
    speakInput.volume = 1;
    speakInput.lang = 'en-IN';
    window.speechSynthesis.speak(speakInput);
};

window.onload = () => {
    greetingFun();
};

const greetingFun = () => {
    let hour = new Date().getHours();
    if (hour >= 0 && hour < 12) {
        speakFun("Good morning Sahil, how can I help you?");
    } else if (hour >= 12 && hour < 16) {
        speakFun("Good afternoon Sahil, how can I help you?");
    } else {
        speakFun("Good evening Sahil, how can I help you?");
    }
};

const startvoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        let recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onresult = (e) => {
            let spokentext = e.results[0][0].transcript;
            handlecommands(spokentext.toLowerCase().trim());
            box.classList.remove("btn-box");
            btn.innerHTML = `<i class="fa-solid fa-microphone-lines-slash"></i>`;
        };

        recognition.start();
    } else {
        alert("Your browser does not support voice input!");
    }
};

btn.onclick = () => {
    box.classList.add("btn-box");
    btn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i>`;
    startvoiceInput();
};

const handlecommands = (commands) => {
    console.log("Command:", commands);

    if (commands.includes("hello") || commands.includes("hi") || commands.includes("hey")) {
        speakFun("Hello sir, how may I help you!");
    }
    else if (commands.startsWith("ask gemini")) {
        let prompt = commands.replace("ask gemini", "").trim();
        if (!prompt) {
            speakFun("Please ask something after saying ask Gemini.");
            return;
        }
    
        speakFun("Let me check with Gemini.");
    
        fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        })
        .then(res => res.json())
        .then(data => {
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (reply) {
                speakFun(reply);
            } else {
                speakFun("Gemini could not generate a response.");
            }
        })
        .catch(() => {
            speakFun("There was an error contacting Gemini.");
        });
    }
    

    else if (commands.includes("tell about yourself") || commands.includes("developed")|| commands.includes("tell me something about you")) {
        speakFun("I am a virtual assistant developed by Sahil, just for your help.");
    }

    else if (commands.includes("what is my name")) {
        speakFun("Your name is Sahil, my developer and my boss.");
    }

    else if (commands.includes("open youtube")) {
        speakFun("Opening YouTube.");
        window.open("https://www.youtube.com/");
    }

    else if (commands.includes("open psit website")) {
        speakFun("Opening PSIT website.");
        window.open("https://www.psit.ac.in/");
    }

    else if (commands.includes("open instagram") || commands.includes("insta")) {
        speakFun("Opening Instagram.");
        window.open("https://www.instagram.com/");
    }

    else if (commands.includes("open facebook")) {
        speakFun("Opening Facebook.");
        window.open("https://www.facebook.com/");
    }

    else if (commands.includes("open college erp") || commands.includes("open my erp")) {
        speakFun("Opening ERP portal.");
        window.open("https://www.erp.psit.ac.in/");
    }

    else if (commands.includes("play music") || commands.includes("play a song")) {
        speakFun("Opening YouTube music.");
        window.open("https://www.youtube.com/results?search_query=top+songs");
    }

    else if (commands.includes("time")) {
        const time = new Date().toLocaleTimeString();
        speakFun(`The time is ${time}`);
    }

    else if (commands.includes("date")) {
        const date = new Date().toLocaleDateString();
        speakFun(`Today's date is ${date}`);
    }
    else if (commands.includes("weather")) {
        speakFun("Getting the weather for Kanpur.");
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=Kanpur&appid=YOUR_API_KEY`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Failed to fetch data");
                }
                return res.json();
            })
            .then(data => {
                // Convert Kelvin to Celsius
                let tempCelsius = (data.main.temp - 273.15).toFixed(2);
                let weatherDescription = data.weather[0].description;
                let weather = `It's ${tempCelsius}°C and ${weatherDescription} in Kanpur.`;
                speakFun(weather);
            })
            .catch(err => {
                speakFun("Sorry, I couldn't fetch the weather. Please try again later.");
            });
    }
    
    
    else if (commands.includes("tell me a joke") || commands.includes("joke") || commands.includes("make me laugh")) {
        const jokes = [
            "Why don’t scientists trust atoms? Because they make up everything!",
            "Why did the JavaScript developer go broke? Because he kept using try without catch!",
            "I told my computer I needed a break, and it said 'No problem, I’ll go to sleep.'"
        ];
        let randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        speakFun(randomJoke);
    }

    else if (commands.includes("search wikipedia for")) {
        let topic = commands.replace("search wikipedia for", "").trim();
        if (topic) {
            speakFun(`Searching Wikipedia for ${topic}`);
            window.open(`https://en.wikipedia.org/wiki/${topic.replace(/ /g, "_")}`);
        } else {
            speakFun("Please specify a topic to search on Wikipedia.");
        }
    }

    else if (commands.includes("search google for")) {
        let query = commands.replace("search google for", "").trim();
        speakFun(`Searching Google for ${query}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }

    else if (commands.includes("send email") || commands.includes("open email")) {
        speakFun("Opening your email client.");
        window.location.href = "mailto:";
    }

    // Handle real apps that cannot be opened via browser
    else if (commands.includes("calculator")|| commands.includes("open calculator")) {
        speakFun("opening...calculator");
        window.open("calculator://");
    }
    else if (commands.includes("whatsapp")|| commands.includes("open whatsapp")) {
        speakFun("opening...whatsapp");
        window.open("whatsapp://");
    }
    else if (commands.includes("goggle chrome")|| commands.includes("open chrome")) {
        speakFun("opening...Goggle chrome");
        window.open(" goggle chrome://");
    }
    

    else if (commands.includes("camera")|| commands.includes("open camera")) {
        speakFun("opening...camera");
        window.open("camera://");

    }

    else if (commands.includes("file manager") || commands.includes("my files")) {
        speakFun("Please open the file manager manually.");
    }

    else if (commands.includes("control panel")) {
        speakFun("opening.....control pannel");
        window.open("control pannel://")
    }
    else if (commands.includes("settings")|| commands.includes("open settings")) {
        speakFun("opening...settings");
        window.open("settings://");
    }

    else if (commands.startsWith("open ")) {
        let site = commands.replace("open ", "").trim().replace(/\s+/g, "");
        if (site && !site.includes(" ")) {
            speakFun(`Opening ${site}`);
            window.open(`https://${site}`);
        }
    }

    else {
        speakFun(`This is what I found on the internet regarding ${commands}`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(commands)}`);
    }
    
    
};


