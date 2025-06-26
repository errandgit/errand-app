import React, { useState, useEffect } from 'react';
import '../styles/LocationDashboard.css';

const LocationDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchLocationStats();
  }, [period]);

  const fetchLocationStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/location/stats?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
      } else {
        setError(data.error || 'Failed to fetch location statistics');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching location stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const getAccuracyGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: '#34c759', text: 'Excellent' };
    if (score >= 80) return { grade: 'A', color: '#34c759', text: 'Very Good' };
    if (score >= 70) return { grade: 'B', color: '#007aff', text: 'Good' };
    if (score >= 60) return { grade: 'C', color: '#ff9500', text: 'Fair' };
    return { grade: 'D', color: '#ff3b30', text: 'Poor' };
  };

  const formatAccuracy = (accuracy) => {
    if (!accuracy) return 'N/A';
    return `±${Math.round(accuracy)}m`;
  };

  if (loading) {
    return (
      <div className="location-dashboard">
        <div className="loading-spinner">Loading location statistics...</div>
      </div>
    );
  }

  return (
    <div className="location-dashboard">
      <div className="dashboard-header">
        <h1>📍 Location Accuracy Dashboard</h1>
        <p>Monitor and analyze location entry accuracy</p>
      </div>

      {/* Period Selection */}
      <div className="period-selector">
        <label>Time Period:</label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Overview Cards */}
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Entries</h3>
                <p className="stat-value">{stats.totalEntries}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3>Average GPS Accuracy</h3>
                <p className="stat-value">{formatAccuracy(stats.averageAccuracy)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>Overall Score</h3>
                <p className="stat-value">
                  {Math.round(stats.averageOverallScore || 0)}/100
                </p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Verification Rate</h3>
                <p className="stat-value">{stats.verificationRate}%</p>
              </div>
            </div>
          </div>

          {/* Accuracy Breakdown */}
          <div className="accuracy-breakdown">
            <h2>Validation Status Breakdown</h2>
            <div className="breakdown-grid">
              <div className="breakdown-item verified">
                <div className="breakdown-icon">✅</div>
                <div className="breakdown-content">
                  <h3>Verified</h3>
                  <p className="breakdown-count">{stats.verifiedCount}</p>
                  <p className="breakdown-percentage">
                    {stats.totalEntries > 0 ? Math.round((stats.verifiedCount / stats.totalEntries) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="breakdown-item approximate">
                <div className="breakdown-icon">⚠️</div>
                <div className="breakdown-content">
                  <h3>Approximate</h3>
                  <p className="breakdown-count">{stats.approximateCount}</p>
                  <p className="breakdown-percentage">
                    {stats.totalEntries > 0 ? Math.round((stats.approximateCount / stats.totalEntries) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="breakdown-item failed">
                <div className="breakdown-icon">❌</div>
                <div className="breakdown-content">
                  <h3>Failed</h3>
                  <p className="breakdown-count">{stats.failedCount}</p>
                  <p className="breakdown-percentage">
                    {stats.totalEntries > 0 ? Math.round((stats.failedCount / stats.totalEntries) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="breakdown-item low-accuracy">
                <div className="breakdown-icon">📍</div>
                <div className="breakdown-content">
                  <h3>Low Accuracy</h3>
                  <p className="breakdown-count">{stats.lowAccuracyCount}</p>
                  <p className="breakdown-percentage">
                    {stats.totalEntries > 0 ? Math.round((stats.lowAccuracyCount / stats.totalEntries) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy Grade */}
          {stats.averageOverallScore && (
            <div className="accuracy-grade">
              <h2>Overall Accuracy Grade</h2>
              <div className="grade-display">
                <div 
                  className="grade-circle"
                  style={{ borderColor: getAccuracyGrade(stats.averageOverallScore).color }}
                >
                  <span 
                    className="grade-letter"
                    style={{ color: getAccuracyGrade(stats.averageOverallScore).color }}
                  >
                    {getAccuracyGrade(stats.averageOverallScore).grade}
                  </span>
                </div>
                <div className="grade-info">
                  <h3>{getAccuracyGrade(stats.averageOverallScore).text}</h3>
                  <p>Average accuracy score: {Math.round(stats.averageOverallScore)}/100</p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="recommendations">
            <h2>💡 Recommendations</h2>
            <div className="recommendation-list">
              {stats.verificationRate < 70 && (
                <div className="recommendation">
                  <span className="rec-icon">🎯</span>
                  <div className="rec-content">
                    <h4>Improve Verification Rate</h4>
                    <p>Your verification rate is {stats.verificationRate}%. Consider providing clearer instructions for location entry.</p>
                  </div>
                </div>
              )}

              {stats.lowAccuracyCount > stats.totalEntries * 0.3 && (
                <div className="recommendation">
                  <span className="rec-icon">📱</span>
                  <div className="rec-content">
                    <h4>GPS Accuracy Issues</h4>
                    <p>Many entries have low GPS accuracy. Encourage users to enable high-accuracy location services.</p>
                  </div>
                </div>
              )}

              {stats.failedCount > stats.totalEntries * 0.2 && (
                <div className="recommendation">
                  <span className="rec-icon">🔧</span>
                  <div className="rec-content">
                    <h4>Address Validation Issues</h4>
                    <p>High failure rate detected. Consider implementing address autocomplete or validation.</p>
                  </div>
                </div>
              )}

              {stats.averageOverallScore < 70 && (
                <div className="recommendation">
                  <span className="rec-icon">⚡</span>
                  <div className="rec-content">
                    <h4>Overall Accuracy Improvement</h4>
                    <p>Consider implementing stricter validation rules or providing better user guidance.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* No Data State */}
      {stats && stats.totalEntries === 0 && (
        <div className="no-data">
          <div className="no-data-icon">📍</div>
          <h3>No Location Data</h3>
          <p>No location entries found for the selected period.</p>
        </div>
      )}
    </div>
  );
};

export default LocationDashboard;
