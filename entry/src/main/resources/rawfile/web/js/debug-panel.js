(function () {
  var MAX_RECORDS = 20;
  var records = [];
  var supportedApis = [];
  var apiListError = '';
  var apiListLoaded = false;
  var ERROR_CODE_NAMES = {
    1001: 'UNKNOWN_ACTION',
    1002: 'PARAM_ERROR',
    1003: 'INTERNAL_ERROR',
    1004: 'CALLBACK_LOST',
    1005: 'TIMEOUT',
    1006: 'PARSE_ERROR',
    1007: 'INVALID_RESPONSE',
    1101: 'NETWORK_INVALID_URL',
    1102: 'NETWORK_UNSUPPORTED_PROTOCOL',
    1103: 'NETWORK_TIMEOUT',
    1104: 'NETWORK_REQUEST_FAILED',
    1105: 'NETWORK_INVALID_RESPONSE',
    1106: 'ABORTED'
  };

  function getErrorCodeName(record) {
    if (record.code === 1006 && String(record.message).indexOf('NATIVE_UNAVAILABLE') !== -1) {
      return 'NATIVE_UNAVAILABLE';
    }
    return ERROR_CODE_NAMES[record.code] || String(record.code);
  }

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
      code: typeof normalized.code === 'number' || typeof normalized.code === 'string' ? normalized.code : '',
      message: normalized.message || '',
      params: clone(normalized.params),
      response: clone(normalized.response),
      startTime: normalized.startTime || Date.now(),
      endTime: normalized.endTime || 0,
      duration: normalized.duration || 0,
      abortTime: normalized.abortTime || 0
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

  function renderApiList() {
    var container = document.getElementById('debugApiList');
    if (!container) {
      return;
    }
    if (apiListError) {
      container.innerHTML = '<p class="debug-api-error">' + escapeHtml(apiListError) + '</p>';
      return;
    }
    if (supportedApis.length === 0) {
      container.innerHTML = apiListLoaded ?
        '<p class="debug-empty">runtime 返回的 API 列表为空</p>' :
        '<p class="debug-empty">点击“加载 API 列表”从 runtime 动态读取</p>';
      return;
    }
    container.innerHTML = supportedApis.map(function (api) {
      return [
        '<article class="debug-api-item">',
        '<div class="debug-api-heading">',
        '<code>' + escapeHtml(api.action) + '</code>',
        '<span>' + escapeHtml(api.category) + ' · ' + (api.implemented ? 'implemented' : 'planned') + '</span>',
        '</div>',
        '<strong>' + escapeHtml(api.title) + '</strong>',
        '<p>' + escapeHtml(api.description) + '</p>',
        '<small>params: ' + escapeHtml(api.paramsText) + '</small>',
        '</article>'
      ].join('');
    }).join('');
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
      var isNetwork = record.action === 'network.request';
      var responseData = record.response && record.response.data ? record.response.data : {};
      var bridgeStatus = record.status === 'resolve' ? 'RESOLVED' :
        (record.status === 'pending' ? 'PENDING' :
          (record.status === 'cancelled' ? 'CANCELLED' :
            (record.status === 'late_after_abort' ? 'LATE_RESPONSE_AFTER_ABORT' : 'REJECTED')));
      var httpStatus = typeof responseData.statusCode === 'number' ? responseData.statusCode : '-';
      var httpOk = typeof responseData.ok === 'boolean' ? String(responseData.ok) : '-';
      var abortTime = typeof record.abortTime === 'number' ?
        new Date(record.abortTime).toISOString() : '-';
      var errorCode = record.code !== 0 && record.code !== '' ?
        (typeof record.code === 'string' ? record.code : getErrorCodeName(record)) : '-';
      var networkMeta = isNetwork ? [
        '<div class="debug-network-status">',
        '<span>Bridge: ' + escapeHtml(bridgeStatus) + '</span>',
        '<span>HTTP: ' + escapeHtml(httpStatus) + '</span>',
        '<span>OK: ' + escapeHtml(httpOk) + '</span>',
        '<span>Duration: ' + escapeHtml(record.duration) + 'ms</span>',
        '<span>Abort Time: ' + escapeHtml(abortTime) + '</span>',
        '<span>Error Code: ' + escapeHtml(errorCode) + '</span>',
        '</div>'
      ].join('') : '';
      return [
        '<details class="debug-record ' + escapeHtml(statusClass) + '">',
        '<summary>',
        '<span class="debug-status">' + escapeHtml(record.status) + '</span>',
        '<span class="debug-action">' + escapeHtml(record.action) + '</span>',
        '<span class="debug-code">code: ' + escapeHtml(record.code) + '</span>',
        '<span class="debug-duration">' + escapeHtml(record.duration) + 'ms</span>',
        '</summary>',
        networkMeta,
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
    recordAbort: function (record) {
      upsert(record);
    },
    recordLateAfterAbort: function (record) {
      upsert(record);
    },
    setApiList: function (apiList) {
      supportedApis = Array.isArray(apiList) ? apiList : [];
      apiListError = '';
      apiListLoaded = true;
      renderApiList();
    },
    setApiListError: function (message) {
      supportedApis = [];
      apiListError = message || 'API 列表加载失败';
      apiListLoaded = true;
      renderApiList();
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

    renderApiList();
    render();
  });
})();
