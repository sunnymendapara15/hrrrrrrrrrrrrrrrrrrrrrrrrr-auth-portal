import React, { useState } from 'react';

const initialState = { email: '', password: '' };

function LoginForm({ onSubmit, onSwitch }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setProcessing(true);
    try {
      await onSubmit(form);
    } catch (err) {
      const message = (err && err.message) || 'Unable to log in';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>HR Login</h2>
      {error && <p className="form-error">{error}</p>}
      <label>
        Email
        <input name="email" type="email" value={form.email} onChange={handleChange} required />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
        />
      </label>
      <button type="submit" disabled={processing}>
        {processing ? 'Logging in…' : 'Log in'}
      </button>
      <p className="form-hint">
        Need an account?{' '}
        <button type="button" className="link-btn" onClick={onSwitch}>
          Sign up
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
