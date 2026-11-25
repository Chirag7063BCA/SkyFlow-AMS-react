import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminExportReport() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('Revenue & Bookings Ledger');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('CSV');

  const handleGenerate = () => {
    alert(`Generating ${format} report for "${reportType}"...`);
    navigate('/admin');
  };

  return (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">Data Extract</p>
          <h2>Export System Report</h2>
        </div>
      </header>

      <section className="panel" style={{ maxWidth: '600px' }}>
        <div className="panel-header">
          <h3>Report Parameters</h3>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
          <div className="form-group">
            <label htmlFor="reportType">Report Type</label>
            <select
              id="reportType"
              className="form-control"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option>Revenue &amp; Bookings Ledger</option>
              <option>Flight Performance &amp; On-Time</option>
              <option>Passenger Manifests</option>
              <option>Operations &amp; Alert Logs</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="reportStartDate">Start Date</label>
              <input
                id="reportStartDate"
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="reportEndDate">End Date</label>
              <input
                id="reportEndDate"
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Export Format</label>
            <div
              style={{
                display: 'flex',
                gap: '24px',
                alignItems: 'center',
                marginTop: '12px',
                flexWrap: 'wrap',
              }}
            >
              <label className="custom-radio">
                <input
                  type="radio"
                  name="format"
                  checked={format === 'CSV'}
                  onChange={() => setFormat('CSV')}
                />
                CSV Spreadsheet
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="format"
                  checked={format === 'PDF'}
                  onChange={() => setFormat('PDF')}
                />
                PDF Document
              </label>
              <label className="custom-radio">
                <input
                  type="radio"
                  name="format"
                  checked={format === 'JSON'}
                  onChange={() => setFormat('JSON')}
                />
                JSON Data
              </label>
            </div>
          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button type="submit" className="primary-btn">
              Generate &amp; Download
            </button>
            <button
              type="button"
              className="ghost-btn ghost-btn-dark"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
