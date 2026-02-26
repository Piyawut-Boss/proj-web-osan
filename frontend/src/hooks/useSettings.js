import { useState, useEffect } from 'react';
import api from '../utils/api';

let _cache = null, _promise = null;

export const invalidateSettings = () => { _cache = null; _promise = null; };

export const useSettings = () => {
  const [settings, setSettings] = useState(_cache || {});
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    if (_cache) { setSettings(_cache); setLoading(false); return; }
    if (!_promise) _promise = api.get('settings').then(r => { _cache = r.data.data || {}; return _cache; }).catch(() => ({}));
    _promise.then(d => { setSettings(d); setLoading(false); });
  }, []);

  const get = (key, fb = '') => settings[key] ?? fb;
  const getLines = (key, fb = '') => (settings[key] ?? fb).split('\n');

  return { settings, loading, get, getLines };
};
