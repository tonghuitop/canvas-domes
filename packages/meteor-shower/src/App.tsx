import { useEffect, useState, useRef, createContext } from 'react'
import MeteorShower from '@/lib'

import './App.css'

function App() {
	const starRef = useRef<MeteorShower | null>(null)

	useEffect(() => {
		const meteorShower = new MeteorShower({ select: '.meteor-shower' })
		starRef.current = meteorShower
		meteorShower.start()
	}, [])

	return <div className="meteor-shower"></div>
}

export default App
