import React, { useState, useEffect } from 'react';

// Tailwind CSS is assumed to be available

// Mock data for authors
const initialAuthors = [
  { id: 1, firstName: 'Jānis', lastName: 'Bērziņš', bio: 'Latviešu rakstnieks un dzejnieks.' },
  { id: 2, firstName: 'Anna', lastName: 'Liepiņa', bio: 'Mūsdienu romānu autore.' },
  { id: 3, firstName: 'Pēteris', lastName: 'Kalniņš', bio: 'Vēsturisko darbu pētnieks.' },
  { id: 4, firstName: 'Līga', lastName: 'Ozoliņa', bio: 'Bērnu grāmatu ilustratore.' },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authors, setAuthors] = useState(() => {
    // Load authors from local storage or use initial data
    const savedAuthors = localStorage.getItem('authors');
    return savedAuthors ? JSON.parse(savedAuthors) : initialAuthors;
  });
  const [currentPage, setCurrentPage] = useState('authors'); // 'authors' or 'admin'
  const [message, setMessage] = useState(''); // For displaying messages to the user

  // Save authors to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('authors', JSON.stringify(authors));
  }, [authors]);

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') { // Simple mock admin login
      setIsLoggedIn(true);
      setIsAdmin(true);
      setMessage('Pieslēgšanās veiksmīga kā administrators!');
    } else if (username === 'user' && password === 'user') { // Simple mock user login
      setIsLoggedIn(true);
      setIsAdmin(false);
      setMessage('Pieslēgšanās veiksmīga kā lietotājs!');
    } else {
      setMessage('Nepareizs lietotājvārds vai parole.');
    }
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setCurrentPage('authors');
    setMessage('Esat veiksmīgi izrakstījies.');
    setTimeout(() => setMessage(''), 3000);
  };

  const addAuthor = (author) => {
    const newAuthor = { ...author, id: authors.length > 0 ? Math.max(...authors.map(a => a.id)) + 1 : 1 };
    setAuthors([...authors, newAuthor]);
    setMessage('Autors veiksmīgi pievienots!');
    setTimeout(() => setMessage(''), 3000);
  };

  const updateAuthor = (updatedAuthor) => {
    setAuthors(authors.map(author =>
      author.id === updatedAuthor.id ? updatedAuthor : author
    ));
    setMessage('Autors veiksmīgi atjaunināts!');
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteAuthor = (id) => {
    setAuthors(authors.filter(author => author.id !== id));
    setMessage('Autors veiksmīgi dzēsts!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4 sm:mb-0">Autoru Pārvaldība</h1>
        <nav className="flex flex-wrap gap-4">
          <button
            onClick={() => setCurrentPage('authors')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentPage === 'authors' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Autori
          </button>
          {isAdmin && (
            <button
              onClick={() => setCurrentPage('admin')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentPage === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Administratora Panelis
            </button>
          )}
          {!isLoggedIn ? (
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-3 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition-all duration-300 shadow-md"
            >
              Pieslēgties
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-all duration-300 shadow-md"
            >
              Izrakstīties
            </button>
          )}
        </nav>
      </header>

      {message && (
        <div className="w-full max-w-4xl bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative mb-4">
          {message}
        </div>
      )}

      <main className="w-full max_w_4xl bg-white shadow-lg rounded-xl p-8">
        {currentPage === 'login' && (
          <Auth onLogin={handleLogin} />
        )}
        {currentPage === 'authors' && (
          <AuthorList authors={authors} />
        )}
        {currentPage === 'admin' && isAdmin && (
          <AdminPanel
            authors={authors}
            addAuthor={addAuthor}
            updateAuthor={updateAuthor}
            deleteAuthor={deleteAuthor}
          />
        )}
        {currentPage === 'admin' && !isAdmin && (
          <div className="text-center text-red-500 text-lg">
            Jums nav atļaujas piekļūt administratora panelim.
          </div>
        )}
      </main>
    </div>
  );
}

function Auth({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">Pieslēgties</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
            Lietotājvārds:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ievadiet lietotājvārdu (piem., admin vai user)"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Parole:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Ievadiet paroli (piem., admin vai user)"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
        >
          Pieslēgties
        </button>
      </form>
    </div>
  );
}

function AuthorList({ authors }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAuthors = authors.filter(author =>
    author.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">Autoru Saraksts</h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Meklēt autoru pēc vārda vai uzvārda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      {filteredAuthors.length === 0 ? (
        <p className="text-center text-gray-600">Nav atrasts neviens autors, kas atbilst meklēšanas kritērijiem.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map(author => (
            <div key={author.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
              <h3 className="text-xl font-bold text-indigo-800 mb-2">{author.firstName} {author.lastName}</h3>
              <p className="text-gray-600 text-sm">{author.bio}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminPanel({ authors, addAuthor, updateAuthor, deleteAuthor }) {
  const [editingAuthor, setEditingAuthor] = useState(null); // Null for new, object for edit
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingAuthor(null);
    setShowForm(true);
  };

  const handleFormSubmit = (author) => {
    if (author.id) {
      updateAuthor(author);
    } else {
      addAuthor(author);
    }
    setShowForm(false);
    setEditingAuthor(null);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingAuthor(null);
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-inner">
      <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">Administratora Panelis</h2>

      <button
        onClick={handleCreateNew}
        className="mb-6 px-6 py-3 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300 shadow-md"
      >
        Pievienot Jaunu Autoru
      </button>

      {showForm && (
        <AuthorForm
          author={editingAuthor}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 rounded-tl-lg">ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Vārds</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Uzvārds</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Biogrāfija</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 rounded-tr-lg">Darbības</th>
              </tr>
            </thead>
            <tbody>
              {authors.map(author => (
                <tr key={author.id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-700">{author.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{author.firstName}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{author.lastName}</td>
                  <td className="py-3 px-4 text-sm text-gray-700">{author.bio}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => handleEdit(author)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs mr-2 transition-colors duration-200"
                    >
                      Rediģēt
                    </button>
                    <button
                      onClick={() => deleteAuthor(author.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs transition-colors duration-200"
                    >
                      Dzēst
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AuthorForm({ author, onSubmit, onCancel }) {
  const [firstName, setFirstName] = useState(author ? author.firstName : '');
  const [lastName, setLastName] = useState(author ? author.lastName : '');
  const [bio, setBio] = useState(author ? author.bio : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      id: author ? author.id : null,
      firstName,
      lastName,
      bio,
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg mb-6 border border-gray-200">
      <h3 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">
        {author ? 'Rediģēt Autoru' : 'Pievienot Jaunu Autoru'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            Vārds:
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Uzvārds:
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
            Biogrāfija:
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24 resize-y"
            required
          ></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
          >
            Atcelt
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 shadow-md"
          >
            {author ? 'Saglabāt Izmaiņas' : 'Pievienot Autoru'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;