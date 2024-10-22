 
let barChartInstance = null;
let lineChartInstance = null;
let doughnutChartInstance = null;


async function getWeather() {
    const city = document.getElementById('city').value || 'Islamabad';
    const apiKey = '13f77a9c381099e1b72d3e0b642d8802';
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        
        const response = await fetch(currentWeatherUrl);
        const data = await response.json();

        if (response.status === 200) {
            document.getElementById('location').innerHTML = `Location: ${data.name}`;
            document.getElementById('main-weather').innerHTML = data.weather[0].main;
            document.getElementById('description').innerHTML = data.weather[0].description;
            document.getElementById('coords').innerHTML = `${data.coord.lat} N, ${data.coord.lon} E`;
            document.getElementById('wind-speed').innerHTML = `speed: ${data.wind.speed} m/s`;
            document.getElementById('wind-deg').innerHTML = `deg: ${data.wind.deg}°`;
            document.getElementById('temp').innerHTML = `${data.main.temp} °C`;
            document.getElementById('min-max-temp').innerHTML = `min: ${data.main.temp_min}°C, max: ${data.main.temp_max}°C`;
            document.getElementById('humidity').innerHTML = `Humidity: ${data.main.humidity}%`;
            document.getElementById('visibility').innerHTML = `Visibility: ${data.visibility}`;
            
            
            setBackgroundVideo(data.weather[0].main);

        } else {
            alert("City not found!");
        }

        
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        
        const dailyTemps = forecastData.list.filter((item, index) => index % 8 === 0).map(item => item.main.temp);
        const forecastDays = forecastData.list.filter((item, index) => index % 8 === 0).map(item => new Date(item.dt_txt).toLocaleDateString());

        
        const weatherConditions = forecastData.list.filter((item, index) => index % 8 === 0).map(item => item.weather[0].main);

        if (barChartInstance) barChartInstance.destroy();
        if (lineChartInstance) lineChartInstance.destroy();
        if (doughnutChartInstance) doughnutChartInstance.destroy();

        
        barChartInstance = createBarChart(forecastDays, dailyTemps); 
        doughnutChartInstance = createDoughnutChart(weatherConditions); 
        lineChartInstance = createLineChart(forecastDays, dailyTemps); 

    } catch (error) {
        alert("Error fetching weather data!");
    }
}


function setBackgroundVideo(weatherCondition) {
    const video = document.querySelector('.background-video');
    let videoSrc;

    switch (weatherCondition) {
        case 'Rain':
            videoSrc = 'assets/rainy.mp4';
            break;
        case 'Clear':
            videoSrc = 'assets/clear.mp4';
            break;
        case 'Clouds':
            videoSrc = 'assets/cloudy.mp4';
            break;
         case 'Haze':
                videoSrc = 'assets/hazy.mp4';
                break;
        case 'Snow':
               videoSrc ='assets/snowy.mp4';
                break;
       
        default:
            videoSrc = 'assets/default.mp4';
    }

    video.src = videoSrc;
    video.load();
}


function createLineChart(labels, data) {
    const ctx = document.getElementById('tempLineChart').getContext('2d');

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Temperature (°C)',
                data: data, 
                borderColor: '#0E6BA8',
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#0E6BA8', 
                pointBorderColor: '#ffffff', 
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff', 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' 
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',
                        font: {
                            size: 10 
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' 
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff', 
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                }
            }
        }
    });
}

function createDoughnutChart(weatherConditions) {
    const ctx = document.getElementById('weatherDoughnut').getContext('2d');

   
    const weatherCount = {};
    weatherConditions.forEach(condition => {
        weatherCount[condition] = (weatherCount[condition] || 0) + 1;
    });

    const labels = Object.keys(weatherCount);
    const data = Object.values(weatherCount);

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels, 
            datasets: [{
                label: 'Weather Conditions',
                data: data, 
                backgroundColor: ['#0E6BA8', '#1F2937', '#3A405A', '#4F627F', '#7D8AA2'],
                hoverBackgroundColor: ['#1f2937'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff', 
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                }
            }
        }
    });
}

function createBarChart(labels, data) {
    const ctx = document.getElementById('tempChart').getContext('2d');

    
    Chart.defaults.font.family = "'Poppins', sans-serif";
    Chart.defaults.font.size = 14;
    Chart.defaults.color = '#ffffff'; 

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: data, 
                backgroundColor: '#0E6BA8', 
                borderColor: '#0E6BA8', 
                borderWidth: 1,
                hoverBackgroundColor: '#1F2937', 
                hoverBorderColor: '#1F2937',      
                hoverBorderWidth: 2   
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff', 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' 
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff',
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' 
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff', 
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 16
                        }
                    }
                }
            }
        }
    });
}
