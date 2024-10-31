// Import components for creating bar and line charts
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
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowLeft, FaInfoCircle, FaRedo } from 'react-icons/fa';
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
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:3004/reports/report-data');
            setData(response.data.data);
            setError('');
        } catch {
            setError("Failed to load data. Please try again later.");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredData = {
        agentBarData: data.agentBarData.filter(d =>
            (!startDate || new Date(d.date) >= startDate) && (!endDate || new Date(d.date) <= endDate)
        ),
        transactionLineData: data.transactionLineData.filter(d =>
            (!startDate || new Date(d._id) >= startDate) && (!endDate || new Date(d._id) <= endDate)
        ),
    };

    const barData = {
        labels: filteredData.agentBarData.map(d => d.agentName),
        datasets: [{
            label: 'Total Transaction Amount',
            data: filteredData.agentBarData.map(d => d.totalAmount),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            barThickness: 20,
            borderRadius: 5
        }]
    };

    const lineData = {
        labels: filteredData.transactionLineData.map(d => d._id),
        datasets: [{
            label: 'Daily Transactions Total',
            data: filteredData.transactionLineData.map(d => d.dailyTotal),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            fill: true
        }]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: context => `Amount: $${context.raw.toLocaleString()}`,
                    title: context => `Date: ${context[0].label}`
                }
            }
        },
        scales: {
            x: { grid: { display: false } },
            y: { ticks: { beginAtZero: true } }
        },
        animation: {
            duration: 1000, // Smooth transition
            easing: 'easeInOutQuad'
        }
    };

    const totalTransactions = filteredData.transactionLineData.reduce((sum, d) => sum + d.dailyTotal, 0);
    const highestTransaction = Math.max(...filteredData.agentBarData.map(d => d.totalAmount));
    const lowestTransaction = Math.min(...filteredData.agentBarData.map(d => d.totalAmount));

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold mb-2">Transaction Reports</h2>
                <p className="text-gray-500">Visualizing agent transactions and daily totals</p>
                <button
                    onClick={() => fetchData()}
                    className="text-blue-500 hover:text-blue-700 transition"
                    title="Refresh Data"
                >
                    <FaRedo className="inline-block text-2xl" />
                </button>
            </div>

            {/* Date Range Filter */}
            <div className="flex items-center justify-center gap-4 mb-4">
                <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End Date"
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            {loading && <div className="text-center text-gray-500">Loading...</div>}
            {error && <div className="text-center text-red-500">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-4 bg-white rounded-lg shadow-lg transition-transform hover:scale-105">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Agent Transactions</h3>
                    <Bar data={barData} options={options} />
                </div>
                <div className="card p-4 bg-white rounded-lg shadow-lg transition-transform hover:scale-105">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Transaction Totals</h3>
                    <Line data={lineData} options={options} />
                </div>
            </div>

            {/* Collapsible Information Panel */}
            <div className="mt-6">
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                    <FaInfoCircle className="mr-2" /> View Summary Information
                </button>
                {showInfo && (
                    <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-gray-800">
                        <p><strong>Total Transactions:</strong> ${totalTransactions.toLocaleString()}</p>
                        <p><strong>Highest Transaction:</strong> ${highestTransaction.toLocaleString()}</p>
                        <p><strong>Lowest Transaction:</strong> ${lowestTransaction.toLocaleString()}</p>
                    </div>
                )}
            </div>

            <button
                onClick={() => navigate("/transactions")}
                className="mt-6 flex items-center px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
            >
                <FaArrowLeft className="mr-2" /> Back to Transactions
            </button>
        </div>
    );
}

export default Report;