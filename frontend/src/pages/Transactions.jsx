import React, { useState, useEffect } from 'react';
import '../styles/Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  // Get user role from localStorage or context
  const userRole = localStorage.getItem('userRole') || 'client';

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [currentPage, dateRange]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      // Determine endpoint based on user role
      const endpoint = userRole === 'provider' 
        ? '/api/transactions/provider/completed'
        : '/api/transactions/client/completed';

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setTransactions(data.data);
        setTotalPages(data.pagination.pages);
        setSummary(data.summary);
      } else {
        setError(data.error || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/transactions/summary?period=30', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setSummary(data.data.summary);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="transactions-page">
        <div className="loading-spinner">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transaction History</h1>
        <p>View your completed transactions and earnings</p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Transactions</h3>
            <p className="summary-value">{summary.totalTransactions}</p>
          </div>
          <div className="summary-card">
            <h3>{userRole === 'provider' ? 'Total Earned' : 'Total Spent'}</h3>
            <p className="summary-value">
              {formatCurrency(
                userRole === 'provider' ? summary.totalEarned : summary.totalSpent,
                summary.currency
              )}
            </p>
          </div>
          <div className="summary-card">
            <h3>Average Transaction</h3>
            <p className="summary-value">
              {formatCurrency(summary.averageTransaction || 0, summary.currency)}
            </p>
          </div>
        </div>
      )}

      {/* Date Range Filter */}
      <div className="filters">
        <div className="date-range-filter">
          <label>
            From:
            <input
              type="date"
              name="startDate"
              value={dateRange.startDate}
              onChange={handleDateRangeChange}
            />
          </label>
          <label>
            To:
            <input
              type="date"
              name="endDate"
              value={dateRange.endDate}
              onChange={handleDateRangeChange}
            />
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {/* Transactions List */}
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No completed transactions found.</p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div key={transaction._id} className="transaction-card">
              <div className="transaction-header">
                <h3>{transaction.service.title}</h3>
                <span className="transaction-amount">
                  {formatCurrency(transaction.price.amount, transaction.price.currency)}
                </span>
              </div>
              
              <div className="transaction-details">
                <div className="transaction-info">
                  <p><strong>Category:</strong> {transaction.service.category}</p>
                  <p><strong>Date:</strong> {formatDate(transaction.scheduledDate)}</p>
                  <p><strong>Payment Method:</strong> {transaction.payment.method || 'N/A'}</p>
                  {transaction.payment.transactionId && (
                    <p><strong>Transaction ID:</strong> {transaction.payment.transactionId}</p>
                  )}
                </div>
                
                <div className="transaction-parties">
                  {userRole === 'client' ? (
                    <div className="provider-info">
                      <p><strong>Service Provider:</strong></p>
                      <p>{transaction.provider.firstName} {transaction.provider.lastName}</p>
                      {transaction.provider.businessName && (
                        <p className="business-name">{transaction.provider.businessName}</p>
                      )}
                    </div>
                  ) : (
                    <div className="client-info">
                      <p><strong>Client:</strong></p>
                      <p>{transaction.client.firstName} {transaction.client.lastName}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="transaction-footer">
                <span className="transaction-status completed">Completed</span>
                <span className="transaction-date">
                  Completed on {formatDate(transaction.updatedAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
