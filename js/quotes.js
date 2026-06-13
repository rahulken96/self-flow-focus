/**
 * Quotes — Daily motivational quotes
 */
const Quotes = (function() {
    'use strict';

    const QUOTES = [
        { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
        { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
        { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
        { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
        { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
        { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
        { text: "Dream bigger. Do bigger.", author: "Unknown" },
        { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
        { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
        { text: "Little things make big days.", author: "Unknown" },
        { text: "It's going to be hard, but hard does not mean impossible.", author: "Unknown" },
        { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
        { text: "Act as if what you do makes a difference. It does.", author: "William James" },
        { text: "What you get by achieving your goals is not as important as what you become.", author: "Zig Ziglar" },
        { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
        { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
        { text: "If you are working on something that you really care about, you don't have to be pushed.", author: "Steve Jobs" },
        { text: "Productivity is being able to do things that you were never able to do before.", author: "Franz Kafka" },
        { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
        { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
        { text: "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.", author: "Stephen King" },
        { text: "You don't have to see the whole staircase, just take the first step.", author: "Martin Luther King Jr." },
        { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
        { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
        { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
        { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
        { text: "Keep your eyes on the stars, and your feet on the ground.", author: "Theodore Roosevelt" },
        { text: "The mind is everything. What you think you become.", author: "Buddha" },
        { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
        { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
        { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
        { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
        { text: "The best revenge is massive success.", author: "Frank Sinatra" },
        { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
        { text: "Wherever you go, go with all your heart.", author: "Confucius" },
        { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
        { text: "Well done is better than well said.", author: "Benjamin Franklin" },
        { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
        { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
        { text: "Life shrinks or expands in proportion to one's courage.", author: "Anaïs Nin" },
        { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
        { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
        { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
        { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
        { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
        { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
        { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
        { text: "Try not to become a man of success. Rather become a man of value.", author: "Albert Einstein" },
        { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
        { text: "What is better? To be born good or to overcome your evil nature through great effort?", author: "Paarthurnax (Skyrim)" },
        { text: "We all make choices, but in the end our choices make us.", author: "Andrew Ryan (BioShock)" },
        { text: "The right man in the wrong place can make all the difference in the world.", author: "G-Man (Half-Life 2)" },
        { text: "Don't be sorry, be better.", author: "Kratos (God of War)" },
        { text: "Do or do not. There is no try.", author: "Yoda (Star Wars)" },
        { text: "All we have to decide is what to do with the time that is given us.", author: "Gandalf (The Lord of the Rings)" },
        { text: "It's not who I am underneath, but what I do that defines me.", author: "Batman (Batman Begins)" },
        { text: "Why do we fall? So that we can learn to pick ourselves up.", author: "Alfred Pennyworth (Batman Begins)" },
        { text: "With great power comes great responsibility.", author: "Uncle Ben (Spider-Man)" },
        { text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", author: "Albus Dumbledore (Harry Potter)" },
        { text: "Part of the journey is the end.", author: "Tony Stark (Avengers: Endgame)" },
        { text: "Hope is a good thing, maybe the best of things, and no good thing ever dies.", author: "Andy Dufresne (The Shawshank Redemption)" },
        { text: "We are who we choose to be.", author: "Green Goblin (Spider-Man)" },
        { text: "You find strength in the things that make you happy.", author: "Arthur Morgan (Red Dead Redemption 2)" },
        { text: "There is a past in all of us, but we must look forward.", author: "Arthur Morgan (Red Dead Redemption 2)" },
        { text: "Even in dark times, we cannot show the darkness that we are feeling.", author: "Kratos (God of War)" },
        { text: "A hero can be anyone, even a man doing something as simple and reassuring as putting a coat on a young boy's shoulders.", author: "Batman (The Dark Knight Rises)" },
        { text: "Protocol 3: I will not lose another pilot.", author: "BT-7274 (Titanfall 2)" },
        { text: "Our lives are defined by opportunities, even the ones we miss.", author: "Benjamin Button (The Curious Case of Benjamin Button)" },
        { text: "The path of the righteous man is beset on all sides by the inequities of the selfish and the tyranny of evil men.", author: "Jules Winnfield (Pulp Fiction)" }
    ];

    let currentQuote = null;

    function init() {
        loadQuote();
        $('#refreshQuote').on('click', function() {
            showRandomQuote();
            saveCurrentQuote();
        });
    }

    function loadQuote() {
        const saved = Storage.get('currentQuote', null);
        const savedDate = Storage.get('quoteDate', null);
        const today = new Date().toDateString();

        if (saved && savedDate === today) {
            currentQuote = saved;
            displayQuote(saved);
        } else {
            showRandomQuote();
            Storage.set('quoteDate', today);
        }
    }

    function showRandomQuote() {
        const idx = Math.floor(Math.random() * QUOTES.length);
        currentQuote = QUOTES[idx];
        displayQuote(currentQuote);
        saveCurrentQuote();
    }

    function displayQuote(q) {
        $('#quoteText').text(q.text);
        $('#quoteAuthor').text('— ' + q.author);
        
        // Dashboard quote
        $('#dashboardQuote').text(q.text);
        $('#dashboardQuoteAuthor').text('— ' + q.author);
    }

    function saveCurrentQuote() {
        if (currentQuote) {
            Storage.set('currentQuote', currentQuote);
            Storage.set('quoteDate', new Date().toDateString());
        }
    }

    function getCurrentQuote() {
        return currentQuote;
    }

    return { init, getCurrentQuote, showRandomQuote };
})();

$(document).ready(function() {
    Quotes.init();
});
