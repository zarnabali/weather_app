let currentPage = 1;
        const entriesPerPage = 10;
        let forecastData = [];

        async function getWeather() {
            const city = document.getElementById('city').value || 'Islamabad';
            const apiKey = '13f77a9c381099e1b72d3e0b642d8802';
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

            try {
                // Fetch current weather data
                const response = await fetch(currentWeatherUrl);
                const data = await response.json();

                if (response.status === 200) {
                    const forecastResponse = await fetch(forecastUrl);
                    const forecastDataResponse = await forecastResponse.json();
                    forecastData = forecastDataResponse.list.filter((item, index) => index % 8 === 0).map(item => {
                        return {
                            date: new Date(item.dt_txt).toLocaleDateString(),
                            temp: item.main.temp,
                        };
                    });

                    currentPage = 1;
                    displayData();
                } else {
                    alert("City not found!");
                }
            } catch (error) {
                alert("Error fetching weather data!");
            }
        }

        function displayData() {
            const tableBody = document.querySelector('#forecastTable tbody');
            tableBody.innerHTML = '';

            const startIndex = (currentPage - 1) * entriesPerPage;
            const endIndex = startIndex + entriesPerPage;
            const paginatedData = forecastData.slice(startIndex, endIndex);

            paginatedData.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${item.date}</td><td>${item.temp} °C</td>`;
                tableBody.appendChild(row);
            });

            document.getElementById('prevPage').disabled = currentPage === 1;
            document.getElementById('nextPage').disabled = endIndex >= forecastData.length;
        }

        function changePage(direction) {
            currentPage += direction;
            displayData();
        }

        async function handleChat() {
            const query = document.getElementById('chatInput').value;
            const responseText = await queryGemini(query);
            document.getElementById('chatOutput').innerText = responseText;
        }

        async function queryGemini(query) {
            const { GoogleGenerativeAI } = require("@google/generative-ai");
            const genAI = new GoogleGenerativeAI('AIzaSyAFGnArcoco0dq6YoFEgYUXosm68QataJo');

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent([`Provide weather forecast for the query: ${query}`]);
            return result.response.text();
        }





        function sortData(order) {
            if (order === 'asc') {
                forecastData.sort((a, b) => a.temp - b.temp);
            } else if (order === 'desc') {
                forecastData.sort((a, b) => b.temp - a.temp);
            }
            currentPage = 1; // Reset to first page after sorting
            displayData();
        }
