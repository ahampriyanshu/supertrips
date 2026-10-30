import { DelhiScene, JaipurScene } from './LandmarkScenes.jsx';
import RegionalScenery from './RegionalScenery.jsx';
import SceneryMotion from './SceneryMotion.jsx';
import './SceneryMotion.css';

function Mountains() {
  return <><path className="place-fill-soft" d="m0 139 90-104 83 87 85-103 104 116 87-79 101 95 90-27v56H0Z" /><path d="m61 69 29-34 28 30-24-8-11 15-9-9m159-15 25-29 31 35-22-8-10 11-10-13" /></>;
}

function Temple({ x = 400, y = 24, coastal = false }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className="place-fill" d="M0 116V75h15C17 47 27 24 37 9c13 21 22 40 23 66h15v41Z" />
      <path d="M0 116V75h15C17 47 27 24 37 9c13 21 22 40 23 66h15v41M12 81h52M17 67h42M21 53h34M26 39h23M31 25h13M26 116V94c0-14 21-14 21 0v22M37 9V0l18 4-18 5" />
      {coastal && <><circle cx="72" cy="108" r="17" /><circle cx="72" cy="108" r="4" /><path d="M72 91v34m-17-17h34m-29-12 24 24m-24 0 24-24" /></>}
    </g>
  );
}

function Palace() {
  return <><path className="place-fill" d="M170 150V81h42V59h15V39h13v20h15v22h45V59h15V39h13v20h15v22h45v69Z" /><path d="M170 150V81h42V59h15V39h13v20h15v22h45V59h15V39h13v20h15v22h45v69M158 150h241M276 150v-29c0-22 30-22 30 0v29M184 97h13v18h-13zm30 0h13v18h-13zm128 0h13v18h-13zm30 0h13v18h-13zM227 39l6-12 7 12m75 0 6-12 7 12" /></>;
}

function Waves() {
  return <g className="place-wave"><path d="M-20 147q40-12 80 0t80 0 80 0 80 0 80 0 80 0 80 0 80 0 80 0M-40 161q40-10 80 0t80 0 80 0 80 0 80 0 80 0 80 0 80 0 80 0" /></g>;
}

function Scene({ scene }) {
  switch (scene) {
    case 'delhi': return <DelhiScene />;
    case 'jaipur': return <JaipurScene />;
    case 'tech':
    case 'towers':
    case 'city':
      return <>
        <path className="place-fill-soft" d="M40 154V84h38v70h26V37h53v117h17V67h64v87h35V19h65v135h35V63h45v91h28V43h62v111h26V91h42v63Z" />
        <path d="M30 154h560M104 154V37h53v117m17 0V67h64v87m35 0V19h65v135m35 0V63h45v91m28 0V43h62v111M286 33h39m-39 13h39m-39 13h39m-39 13h39m-39 13h39m-39 13h39m-39 13h39m-39 13h39M116 50h29m-29 14h29m-29 14h29m-29 14h29m-29 14h29m-29 14h29M459 57v82m13-82v82m13-82v82m13-82v82" />
        {scene === 'tech' && <g className="place-signal"><path d="M56 113h65v28h70m163-52h48v42h47" /><circle cx="56" cy="113" r="3" /><circle cx="191" cy="141" r="3" /><circle cx="449" cy="131" r="3" /></g>}
      </>;
    case 'braj':
    case 'temple':
      return <>
        <path className="place-fill-soft" d="M0 155q160-35 320-12t320-3v40H0Z" />
        <Temple x={360} y={24} /><Temple x={451} y={42} />
        <path d="M355 141h183m-196 7h207m-219 7h231M75 143c-3-42 12-79 33-101m-33 81c-25-5-33-24-22-38 21 6 25 22 22 38Zm5-29c-1-25 11-37 29-35 5 20-6 32-29 35Z" />
        <g className="place-petal"><path className="place-fill" d="M183 49q-12-11 1-17 14 7-1 17Zm61 33q-13-6-6-17 15 2 6 17Zm-40 46q-15-2-11-15 15-3 11 15Z" /></g>
      </>;
    case 'ghats':
      return <>
        <path className="place-fill-soft" d="M0 137h640v43H0Z" />
        <path className="place-fill" d="M140 132V88h46V64h48v68h33V80h53v52h40V91h43v41Z" />
        <path d="M120 139h320m-334 8h348m-365 8h381M140 132V88h46V64h48v68m33 0V80h53v52m40 0V91h43v41M151 100h12v16h-12zm49-23h12v16h-12zm80 16h12v16h-12z" />
        <Temple x={323} y={4} />
        <path d="M475 132V86h63v46m-68-46c0-34 73-34 73 0h-73Zm31-26V47h12v13M466 132h81M487 98h8m12 0h8m12 0h8" />
        <g className="place-lamps"><path d="M57 147h18q-9 13-18 0Zm61 16h14q-7 9-14 0Zm438-11h18q-9 13-18 0Z" /><path className="place-flame" d="M66 144c-7-2-2-9 0-12 3 5 6 9 0 12Zm499 4c-7-2-2-9 0-12 3 5 6 9 0 12Z" /></g>
      </>;
    case 'tram':
      return <>
        <path className="place-fill-soft" d="M42 105V82l26-20 26 20v23h30V55h53v50h35V70h53v35h55V36h37v69h49V60h42v45Z" />
        <path d="M20 139h600M20 148h600M410 121V33m0 6 83 64m-83-64-53 64m136 18V39m0 5 93 59M349 103h245M30 41h368M68 41v96m296-96v96" />
        <g className="place-tram"><path className="place-fill" d="M163 132V75q0-10 12-10h119q12 0 12 10v57Z" /><path d="M163 132V75q0-10 12-10h119q12 0 12 10v57H163Zm8-47h126m-104-18v48m26-48v48m27-48v48m26-48v48M170 119h129M220 65l22-23h-39" /><circle cx="185" cy="137" r="6" /><circle cx="282" cy="137" r="6" /></g>
      </>;
    case 'temple-coast':
      return <><path className="place-fill-soft" d="M0 151q200-25 330-7t310-4v40H0Z" /><Temple x={388} y={13} coastal /><path d="M374 135h126M85 144l-6-8 27-1-8 9Zm7-12v-22l17 18H92" /><Waves /></>;
    case 'dunes':
      return <>
        <circle className="place-sun place-fill" cx="475" cy="53" r="23" />
        <g className="place-dunes-back"><path className="place-fill-soft" d="M-70 156Q70 25 254 127T710 111v90H-70Z" /><path d="M-70 156Q70 25 254 127T710 111" /></g>
        <g className="place-dunes-front"><path className="place-fill" d="M-70 177Q148 64 337 151T710 148v53H-70Z" /><path d="M-70 177Q148 64 337 151T710 148M69 154q77-31 153-17m-96 26q43-12 87-6" /></g>
      </>;
    case 'lake':
      return <><Mountains /><path className="place-fill-soft" d="M0 137h640v43H0Z" /><path d="M69 113V63l-17 21h12l-21 23h20l-20 19h51l-20-19h19L74 84h12L69 63m0 63v15M555 127V79l-21 27h15l-22 25h55l-23-25h16l-20-27" /><g className="place-boat"><path className="place-fill" d="M252 144h112l-18 12h-72Z" /><path d="M252 144h112l-18 12h-72Zm25-1v-18q28-25 59 0v18m-66-18h74" /></g><Waves /></>;
    case 'forest':
    case 'hills':
      return <>
        <path className="place-fill-soft" d="M0 117q100-111 215-21t228-15 197 26v73H0Z" />
        <path className="place-fill" d="M0 155q140-100 296-25t344-20v70H0Z" />
        <path d="M0 155q140-100 296-25t344-20M50 150q74-33 153-10m-95 17q55-16 96-7m221-8q62-17 124-7m-84 16 67-4" />
        {scene === 'forest' ? <path d="M84 127V52m0 24C51 75 49 51 50 39c29 3 35 20 34 37Zm0 23c35-7 44-24 40-44-27 7-38 24-40 44Zm407 25V39m0 31c-32-5-40-22-35-43 28 5 36 21 35 43Zm0 28c33-7 44-24 41-42-26 4-39 20-41 42Z" /> : <path d="M403 130V99h48v31m-58-31 34-24 34 24h-68m25 31v-16h18v16M74 136V74m-24 32 24-32 24 32H50m-5 16 29-32 29 32H45" />}
        <g className="place-mist"><path d="M-30 88q110-19 220 0t220 0 220 0M75 102q110-19 220 0t220 0" /></g>
      </>;
    case 'monastery':
      return <><Mountains /><path className="place-fill" d="M290 149V92h85v57Z" /><path d="M290 149V92h85v57m-93-57h101l-17-14h-67l-17 14Zm16-14h68l-11-13h-47l-10 13Zm23 71v-26h20v26M49 57q102 49 222 0" /><g className="place-flags"><path d="M78 70v21l15 4V75m18 4v23l15 1V83m18 1v23l15-1V85m18-1v23l15-2V82m18-3v23l15-4V75" /></g></>;
    case 'dome':
      return <><path className="place-fill-soft" d="M170 150V102h260v48Z" /><path d="M170 150V102h260v48M244 102V82h108v20m-108-20c0-34 54-54 54-62 0 8 54 28 54 62H244Zm29 68v-25c0-32 51-32 51 0v25M153 150V49h10v101m-15-101 10-14 10 14h-20m269 101V49h10v101m-15-101 10-14 10 14h-20M139 156h321M298 20V9" /></>;
    case 'palace': return <><circle className="place-sun place-fill-soft" cx="477" cy="49" r="22" /><Palace /><path d="M15 153h124m280 0h202" /></>;
    case 'river':
    case 'coast':
    default:
      return <><circle className="place-sun place-fill-soft" cx="438" cy="53" r="23" /><path className="place-fill-soft" d="M0 145q140-30 280 0t360-4v39H0Z" /><path d="M84 143q14-55 9-91m0 0q-31-23-54 8 29-10 54-8Zm0 0q29-28 59 2-34-10-59-2Zm0 0q-10-29 6-37 6 16-6 37Zm0 0q-35 2-42 34 20-17 42-34Z" /><g className="place-boat"><path d="M288 139h102l-16 14h-66l-20-14Zm49-1V67l-38 61h38m6-52 30 52h-30" /></g><Waves /></>;
  }
}

export default function CityScenery({ theme, animated = false }) {
  const art = theme.illustration;
  const hasLandmarks = Boolean(art || theme.landmarks?.length);
  return (
    <figure className={`place-postcard${hasLandmarks ? ' place-postcard--landmarks' : ''}${animated ? ' place-postcard--alive' : ''}`} key={theme.id}>
      <svg className="place-drawing" viewBox={hasLandmarks ? '0 0 720 280' : '0 0 640 180'} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" role={hasLandmarks ? 'img' : undefined} aria-label={art?.description || theme.sceneDescription} aria-hidden={hasLandmarks ? undefined : true}>
        {art && !['delhi', 'jaipur'].includes(art.kind) ? <RegionalScenery art={art} /> : <Scene scene={theme.scene} />}
        {animated && <SceneryMotion theme={theme} />}
      </svg>
    </figure>
  );
}

