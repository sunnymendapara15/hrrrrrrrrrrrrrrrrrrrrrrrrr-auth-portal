import React, { useState } from 'react';

const initialState = { name: '', email: '', password: '', role: 'hr' };

function SignupForm({ onSubmit, onSwitch }) {
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
      const message = (err && err.message) || 'Unable to sign up';
      setError(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>HR Signup</h2>
      {error && <p className="form-error">{error}</p>}
      <label>
        Full name
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
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
      <label>
        Role
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="hr">HR Staff</option>
          <option value="manager">Manager</option>
        </select>
      </label>
      <button type="submit" disabled={processing}>
        {processing ? 'Creating account…' : 'Sign up'}
      </button>
      <p className="form-hint">
        Already have an account?{' '}
        <button type="button" className="link-btn" onClick={onSwitch}>
          Log in
        </button>
      </p>
    </form>
  );
}

export default SignupForm;
