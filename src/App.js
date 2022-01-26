import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './components/commons/Landing';
import { Auth, Inpatients, Inpatient, About, PageNotFound } from './views';
import AuthContextProvider from './contexts/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import InpatientContextProvider from './contexts/InpatientContext';

function App() {
	return (
		<div className="App">
			{/* <Link to="/">Landing</Link> */}
			<AuthContextProvider>
				<InpatientContextProvider>
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/login" element={<Auth authRoute="login" />} />
						<Route path="/register" element={<Auth authRoute="register" />} />
						{/* <ProtectedRoute path="/dashboard" element={<Dashboard />} /> */}
						<Route
							path="/inpatients"
							element={
								<ProtectedRoute>
									<Inpatients />
								</ProtectedRoute>
							}
						></Route>
						<Route
							path="/inpatients/:id"
							element={
								<ProtectedRoute>
									<Inpatient />
								</ProtectedRoute>
							}
						/>
						<Route
							path="/about"
							element={
								<ProtectedRoute>
									<About />
								</ProtectedRoute>
							}
						/>
						<Route
							path="*"
							element={
								<ProtectedRoute>
									<PageNotFound />
								</ProtectedRoute>
							}
						/>
					</Routes>
				</InpatientContextProvider>
			</AuthContextProvider>
		</div>
	);
}

export default App;
