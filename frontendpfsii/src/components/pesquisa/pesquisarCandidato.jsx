import React, { useState, useEffect } from 'react';

function PesquisaCandidato({ onSearch }) {
  const [termo, setTermo] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(termo);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [termo, onSearch]);

  const handleChange = (e) => {
    setTermo(e.target.value);
  };

  return (
    <form className="mb-3 d-flex justify-content-center">
      <div className="input-group" style={{ maxWidth: '600px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Pesquisar por nome ou CPF"
          value={termo}
          onChange={handleChange}
        />
      </div>
    </form>
  );
}

export default PesquisaCandidato;
