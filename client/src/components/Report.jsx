import axios from 'axios';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2'; // chartjs
import DatePicker from 'react-datepicker'; // datepicker
import 'react-datepicker/dist/react-datepicker.css'; // datepicker
import { AiOutlineClose } from 'react-icons/ai';
import { FaArrowLeft, FaExpand, FaInfoCircle, FaRedo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend
);

function Report() {
    const [data, setData] = useState({ agentBarData: [], transactionLineData: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [showInfo, setShowInfo] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Lightbox
    const [selectedChart, setSelectedChart] = useState(null);
    const navigate = useNavigate();

    // Fixed Y-axis maximum for consistent scaling
    const FIXED_MAX_AMOUNT = 10000;

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const params = {};
            if (startDate) {
                params.startDate = startDate.toISOString().split('T')[0];
            }
            if (endDate) {
                params.endDate = endDate.toISOString().split('T')[0];
            }

            const response = await axios.get('http://localhost:3004/reports/report-data', { params });
            if (response.data && response.data.data) {
                setData(response.data.data);
                setError('');
            }
        } catch (error) {
            console.error('Data fetch error:', error);
            setError("Failed to load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate, fetchData]);

    const aggregatedAgentData = data.agentBarData.reduce((acc, curr) => {
        const agent = acc.find(a => a.agentName === curr.agentName);
        if (agent) {
            agent.totalAmount += curr.totalAmount;
        } else {
            acc.push({
                agentName: curr.agentName,
                totalAmount: curr.totalAmount
            });
        }
        return acc;
    }, []);

    const highestTransaction = Math.max(...aggregatedAgentData.map(d => d.totalAmount), 0);

    const barData = {
        labels: aggregatedAgentData.map(d => d.agentName),
        datasets: [{
            label: 'Total Transaction Amount',
            data: aggregatedAgentData.map(d => d.totalAmount),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            barThickness: 20,
            borderRadius: 5
        }]
    };

    const lineData = {
        labels: data.transactionLineData.map(d => d._id),
        datasets: [{
            label: 'Daily Transactions Total',
            data: data.transactionLineData.map(d => d.dailyTotal),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: true
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true, // Change to true
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: context => `Amount: $${context.raw.toLocaleString()}`,
                    title: context => `${context[0].label}`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => `$${value.toLocaleString()}`,
                    font: {
                        size: 11
                    }
                },
                min: 0,
                max: Math.max(FIXED_MAX_AMOUNT, highestTransaction * 1.1),
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            }
        }
    };

    const totalTransactions = data.transactionLineData.reduce((sum, d) => sum + d.dailyTotal, 0);
    const lowestTransaction = Math.min(...aggregatedAgentData.map(d => d.totalAmount), 0);

    const handleChartClick = (chartType) => {
        setSelectedChart(chartType);
        setIsLightboxOpen(true); // Lightbox
    };

    const handleCloseLightbox = () => setIsLightboxOpen(false); // Lightbox

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="text-left">
                    <h2 className="text-3xl font-semibold mb-1 flex items-center">
                        Transaction Reports
                        <FaInfoCircle
                            className="ml-2 text-gray-400 cursor-pointer hover:text-blue-600"
                            onClick={() => setShowInfo(true)}
                        />
                    </h2>
                    <p className="text-gray-500">Visualizing agent transactions and daily totals</p>
                </div>
                <div className="flex items-center space-x-4">
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Start Date"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm hover:shadow-md transition w-32"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        placeholderText="End Date"
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm hover:shadow-md transition w-32"
                    />
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 shadow-lg transition"
                    >
                        <FaRedo />
                        <span>Refresh Data</span>
                    </button>
                </div>
            </div>

            {loading && (
                <div className="text-center text-gray-500 py-4">
                    Loading...
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 py-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative h-[400px]">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Agent Transactions</h3>
                    <div className="h-[calc(100%-4rem)]">
                        <Bar data={barData} options={options} />
                    </div>
                    <FaExpand
                        className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-blue-600"
                        onClick={() => handleChartClick('bar')}
                    />
                </div>
                <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative h-[400px]">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Transaction Totals</h3>
                    <div className="h-[calc(100%-4rem)]">
                        <Line data={lineData} options={options} />
                    </div>
                    <FaExpand
                        className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-blue-600"
                        onClick={() => handleChartClick('line')}
                    />
                </div>
            </div>

            <button
                onClick={() => navigate("/transactions")}
                className="mt-8 inline-flex items-center px-6 py-3 text-blue-600 bg-blue-50/50
                           hover:bg-blue-100 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
            >
                <FaArrowLeft className="mr-2" />
                Back to Transactions
            </button>

            {showInfo && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-6">
                    <div className="bg-white rounded-lg p-8 shadow-xl transform scale-95 animate-scale-up duration-300 w-full max-w-4xl">
                        <div
                            onClick={() => setShowInfo(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition duration-200 ease-in-out focus:outline-none"
                            aria-label="Close"
                        >
                            <AiOutlineClose size={24} />
                        </div>
                        <div className="text-gray-800">
                            <h3 className="text-2xl font-semibold mb-4">Summary Information</h3>
                            <p><strong>Total Transactions:</strong> ${totalTransactions.toLocaleString()}</p>
                            <p><strong>Highest Transaction:</strong> ${highestTransaction.toLocaleString()}</p>
                            <p><strong>Lowest Transaction:</strong> ${lowestTransaction.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}

            {isLightboxOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-6">
                    <div className="bg-white rounded-lg p-8 shadow-xl transform scale-95 animate-scale-up duration-300 w-full max-w-4xl h-[600px]">
                        <div
                            onClick={handleCloseLightbox}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition duration-200 ease-in-out focus:outline-none"
                            aria-label="Close"
                        >
                            <AiOutlineClose size={24} />
                        </div>
                        <div className="h-full">
                            {selectedChart === 'bar' ? (
                                <Bar data={barData} options={options} />
                            ) : (
                                <Line data={lineData} options={options} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Report;