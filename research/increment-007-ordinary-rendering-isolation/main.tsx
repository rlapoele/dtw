import {createRoot} from 'react-dom/client';
import {App} from '@presentation/app/App';
import {InMemoryProjectStorage} from '@adapters/in-memory-project-storage';
import type {ProjectSnapshot} from '@application/project-storage';
import {snapshot} from './fixtures.mjs';
import './style.css';
import './specimen';
// The unchanged application is used ONLY with the frozen small fixture.
if (!location.search.includes('leaf')) {
 const storage=new InMemoryProjectStorage([snapshot('small') as unknown as ProjectSnapshot]);
 createRoot(document.getElementById('root')!).render(<App storage={storage} initialProjectId="p"/>);
}
