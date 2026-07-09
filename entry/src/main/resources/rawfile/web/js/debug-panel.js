(function () {
  var MAX_RECORDS = 20;
  var records = [];

  function clone(value) {
    try {
      return JSON.parse(JSON.stringify(value || {}));
    } catch (err) {
      return {};
    }
  }

  function findRecord(requestId) {
    for (var i = 0; i < records.length; i += 1) {
      if (records[i].requestId === requestId) {
        return records[i];
      }
    }
    return null;
  }

  function normalizeRecord(record) {
    var normalized = record || {};
    return {
      requestId: normalized.requestId || '',
      action: normalized.action || '',
      status: normalized.status || 'pending',
      code: typeof normalized.code === 'number' ? normalized.code : '',
      message: normalized.message || '',
      params: clone(normalized.params),
      response: clone(normalized.response),
      startTime: normalized.startTime || Date.now(),
      endTime: normalized.endTime || 0,
      duration: normalized.duration || 0
    };
  }

  function upsert(record) {
    var current = findRecord(record.requestId);
    if (current) {
      Object.assign(current, record);
    } else {
      records.unshift(normalizeRecord(record));
    }

    if (records.length > MAX_RECORDS) {
      records = records.slice(0, MAX_RECORDS);
    }

    render();
  }

  function getRecordsContainer() {
    return document.getElementById('debugRecords');
  }

  function getExportOutput() {
    return document.getElementById('debugExportOutput');
  }

  function formatJson(value) {
    try {
      return JSON.stringify(value || {}, null, 2);
    } catch (err) {
      return '{}';
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function render() {
    var container = getRecordsContainer();
    if (!container) {
      return;
    }

    if (records.length === 0) {
      container.innerHTML = '<p class="debug-empty">暂无调用记录</p>';
      return;
    }

    container.innerHTML = records.map(function (record) {
      var statusClass = 'debug-record--' + record.status;
      return [
        '<details class="debug-record ' + escapeHtml(statusClass) + '">',
        '<summary>',
        '<span class="debug-status">' + escapeHtml(record.status) + '</span>',
        '<span class="debug-action">' + escapeHtml(record.action) + '</span>',
        '<span class="debug-code">code: ' + escapeHtml(record.code) + '</span>',
        '<span class="debug-duration">' + escapeHtml(record.duration) + 'ms</span>',
        '</summary>',
        '<div class="debug-meta">requestId: ' + escapeHtml(record.requestId) + '</div>',
        '<div class="debug-meta">message: ' + escapeHtml(record.message) + '</div>',
        '<pre class="debug-json">params: ' + escapeHtml(formatJson(record.params)) + '</pre>',
        '<pre class="debug-json">response: ' + escapeHtml(formatJson(record.response)) + '</pre>',
        '</details>'
      ].join('');
    }).join('');
  }

  window.MyASCFDebugPanel = {
    recordStart: function (record) {
      upsert(record);
    },
    recordEnd: function (record) {
      upsert(record);
    },
    recordError: function (record) {
      upsert(record);
    },
    recordLost: function (record) {
      upsert(record);
    },
    clear: function () {
      records = [];
      render();
      var output = getExportOutput();
      if (output) {
        output.textContent = '';
      }
    },
    exportJSON: function () {
      var text = JSON.stringify(records, null, 2);
      var output = getExportOutput();
      if (output) {
        output.textContent = text;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(function () {});
      }
      return text;
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var clearButton = document.getElementById('debugClearButton');
    var exportButton = document.getElementById('debugExportButton');

    if (clearButton) {
      clearButton.addEventListener('click', function () {
        window.MyASCFDebugPanel.clear();
      });
    }

    if (exportButton) {
      exportButton.addEventListener('click', function () {
        window.MyASCFDebugPanel.exportJSON();
      });
    }

    render();
  });
})();
