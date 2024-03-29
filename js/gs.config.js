// ############################################################
// All listed setting can be changed only by editing this file
// Other settings can be changed from CPanel/Manage server
// ############################################################

var gsValues = new Array(); // do not remove

// map min zoom
gsValues['map_min_zoom'] = 3;

// map max zoom
gsValues['map_max_zoom'] = 18;

// realtime object data refresh, default 10 seconds
gsValues['map_refresh'] = 10;

// events refresh, default 30 seconds
gsValues['event_refresh'] = 30;

// cmd status refresh, default 60 seconds
gsValues['cmd_status_refresh'] = 60;

// img gallery refresh, default 60 seconds
gsValues['img_refresh'] = 60;

// chat refresh, default 10 seconds
gsValues['chat_refresh'] = 10;

// billing refresh, default 60 seconds
gsValues['billing_refresh'] = 60;

// check if user session is still active if not block and ask for login, default 30 seconds, false - do not check;
gsValues['session_check'] = 30;

// show address in bottom left panel (not recommended, it will run out of geocoder daily limit very fast and address won't show that day anymore), true or false
gsValues['side_panel_address'] = false;

// supported GPS device protocols
gsValues['protocol_list'] = new Array();
gsValues['protocol_list'] = [
                                // HTTP protocols
                                {name: 'android'},
                                {name: 'blackberry'},
                                {name: 'iphone'},
                                {name: 'wp'},
                                // TCP and UDP listener protocols
                                {name: 'demo'},
                                {name: 'agps'},
                                {name: 'amt'},
                                {name: 'amwell'},
                                {name: 'anbtek'},
                                {name: 'apkcom'},
                                {name: 'aplicom'},
                                {name: 'aquilatrack'},
                                {name: 'atrack'},
                                {name: 'autofon'},
                                {name: 'autoleaders'},
                                {name: 'bce'},
                                {name: 'bitrek'},
                                {name: 'bofan'},
                                {name: 'bstechnotronics'},
                                {name: 'c2stek'},
                                {name: 'calamp'},
                                {name: 'careuueco'},
                                {name: 'carrideo'},
                                {name: 'castelobd'},
                                {name: 'castelsat802'},
                                {name: 'chinaradio'},
                                {name: 'coban'},
                                {name: 'cobangmt'},
                                {name: 'concoxgt100'},
                                {name: 'concoxgt02'},
                                {name: 'concoxgt03'},
                                {name: 'concoxgt06'},
                                {name: 'concoxgt300'},
                                {name: 'concoxgt710'},
                                {name: 'concoxgt800'},
                                {name: 'concoxx1'},
                                {name: 'cybergraphy'},
                                {name: 'dct'},
                                {name: 'detero'},
                                {name: 'digitalsystemsdsf'},
                                {name: 'digitalsystemsdsf30'},
                                {name: 'disha'},
                                {name: 'eelink'},
                                {name: 'falcomsteppiii'},
                                {name: 'falcomsteppiii_wo_gpiop'},
                                {name: 'fifotrack'},
                                {name: 'flextrack'},
                                {name: 'galileosky'},
                                {name: 'gator'},
                                {name: 'genekofox'},
                                {name: 'globalsattr151'},
                                {name: 'globalsattr203'},
                                {name: 'globalsattr600'},
                                {name: 'globalsatgtr128'},
                                {name: 'gosafe'},
                                {name: 'gotop'},
                                {name: 'haicom'},
                                {name: 'hbt10'},
                                {name: 'inteliot'},
                                {name: 'intellitracx1'},
                                {name: 'internex'},
                                {name: 'istartekvt206'},
                                {name: 'istartekvt600'},
                                {name: 'itrac'},
                                {name: 'itraca1'},
                                {name: 'jointech'},
                                {name: 'jointechjt701'},
                                {name: 'jtrack'},
                                {name: 'keson'},
                                {name: 'khd'},
                                {name: 'khm100a'},
                                {name: 'maestro'},
                                {name: 'mastrack'},
                                {name: 'maxepor'},
                                {name: 'megastek'},
                                {name: 'megastekgvt369'},
                                {name: 'megastekgvt800'},
                                {name: 'meiligao'},
                                {name: 'meitrack'},
                                {name: 'meitrackp99g'},
                                {name: 'meitrackt322'},
                                {name: 'mictrack'},
                                {name: 'minifinder'},
                                {name: 'minova'},
                                {name: 'mplatam100'},
                                {name: 'mplatat150'},
                                {name: 'navtelecom'},
                                {name: 'noran'},
                                {name: 'oigo'},
                                {name: 'oko'},
                                {name: 'oner'},
                                {name: 'oriontechnology'},
                                {name: 'pointer'},
                                {name: 'pretrace'},
                                {name: 'queclink'},
                                {name: 'queclinkgb100'},
                                {name: 'queclinkgl200'},
                                {name: 'queclinkgl300'},
                                {name: 'queclinkgl300w'},
                                {name: 'queclinkgl500'},
                                {name: 'queclinkgmt100'},
                                {name: 'queclinkgmt200'},
                                {name: 'queclinkgs100'},
                                {name: 'queclinkgt300'},
                                {name: 'queclinkgt301'},
                                {name: 'queclinkgt500'},
                                {name: 'queclinkgv200'},
                                {name: 'queclinkgv300'},
                                {name: 'queclinkgv300w'},
                                {name: 'queclinkgv500'},
                                {name: 'queclinkgv55'},
                                {name: 'queclinkgv65'},
                                {name: 'queclinkgv75'},
                                {name: 'queclinkgv75w'},
                                {name: 'queclinktrs'},
                                {name: 'raveon'},
                                {name: 'roadsay'},
                                {name: 'ruptela'},
                                {name: 'sanav'},
                                {name: 'satellitesolutions'},
                                {name: 'silicontechlabs'},
                                {name: 'siwi'},
                                {name: 'skypatrol'},
                                {name: 'skytrackjb101'},
                                {name: 'spystoreitaliaperfect3'},
                                {name: 'suntech'},
                                {name: 'telcomip'},
                                {name: 'teltonikaat'},
                                {name: 'teltonikafm'},
                                {name: 'teltonikagh'},
                                {name: 'thinkpower'},
                                {name: 'tkstar'},
                                {name: 'tlt2h'},
                                {name: 'topflytech'},
                                {name: 'topin'},
                                {name: 'topten'},
                                {name: 'totemtech'},
                                {name: 'tracerx2'},
                                {name: 'trackpro'},
                                {name: 'twig'},
                                {name: 'trackertechnologymsp340'},
                                {name: 'trackertechnologymsp350'},
                                {name: 'tytan'},
                                {name: 'tzonedigital'},
                                {name: 'ulbotech'},
                                {name: 'uniguard'},
                                {name: 'unknown056'},
                                {name: 'unknown807rf'},
                                {name: 'unknowncctr800'},
                                {name: 'unknowng64'},
                                {name: 'unknowngm908'},
                                {name: 'unknowngp106m'},
                                {name: 'unknowngpst1086'},
                                {name: 'unknownhw18'},
                                {name: 'unknownm60'},
                                {name: 'unknownpg88'},
                                {name: 'unknownpolgps1'},
                                {name: 'unknownpt3000'},
                                {name: 'unknownstl060'},
                                {name: 'unknownt0024'},
                                {name: 'unknowntc45'},
                                {name: 'unknowntk103'},
                                {name: 'unknowntk103_2'},
                                {name: 'unknowntk103_3'},
                                {name: 'unknowntk103_4'},
                                {name: 'unknowntk103_5'},
                                {name: 'unknowntk106'},
                                {name: 'unknowntk20g'},
                                {name: 'unknowntl206'},
                                {name: 'unknowntr10'},
                                {name: 'unknownvt206'},
                                {name: 'unknownwb1g'},
                                {name: 'visiontek86vtu'},
                                {name: 'visiontek87vtu'},
                                {name: 'carrideo'},
                                {name: 'wialonips'},
                                {name: 'xexun'},
                                {name: 'yuwei'},
                                {name: 'zendazdvt2'}
                        ];

// supported GPS device list
gsValues['device_list'] = new Array();
gsValues['device_list'] = [
                                {name: 'AGPS 010'},
                                {name: 'AGPS 020'},
                                {name: 'AMT MT-OBD'},
                                {name: 'AMT MT10'},
                                {name: 'AMT MT20'},
                                {name: 'AMT MT50H'},
                                {name: 'AMT MT60'},
                                {name: 'AMT MT65'},
                                {name: 'AMT MT80'},
                                {name: 'AMT MT100S'},
                                {name: 'AMT MT300S'},
                                {name: 'AMT MT365'},
                                {name: 'AMT MT815'},
                                {name: 'Amwell T20'},
                                {name: 'Amwell T360-101A'},
                                {name: 'Amwell T360-101E'},
                                {name: 'Amwell T360-101P'},
                                {name: 'Amwell T360-103'},
                                {name: 'Amwell T360-108'},
                                {name: 'Amwell T360-269'},
                                {name: 'Amwell T360-269B'},
                                {name: 'Amwell T360-269JT'},
                                {name: 'ANBTEK TS10'},
                                {name: 'ANBTEK TS20'},
                                {name: 'ANBTEK TS30'},
                                {name: 'ANBTEK TS100W'},
                                {name: 'APK-COM'},
                                {name: 'Aplicom A1 MAX'},
                                {name: 'Aplicom A1 MAX RDL'},
                                {name: 'Aplicom A1 TRAX'},
                                {name: 'Aplicom A9 NEX'},
                                {name: 'Aplicom A9 Quick'},
                                {name: 'Aplicom A9 Trix'},
                                {name: 'Aplicom A9 IPEX'},
                                {name: 'Aquila Track'},
                                {name: 'ATrack AK1'},
                                {name: 'ATrack AK7'},
                                {name: 'ATrack AL1'},
                                {name: 'ATrack AL7'},
                                {name: 'ATrack AP1'},
                                {name: 'ATrack AS1'},
                                {name: 'ATrack AS3'},
                                {name: 'ATrack AT1'},
                                {name: 'ATrack AT1Pro'},
                                {name: 'ATrack AT5i'},
                                {name: 'ATrack AU5i'},
                                {name: 'ATrack AU7'},
                                {name: 'ATrack AX5'},
                                {name: 'ATrack AX7'},
                                {name: 'ATrack AX9'},
                                {name: 'ATrack AY5i'},
                                {name: 'AutoFon'},
                                {name: 'Auto Leaders 800C'},
                                {name: 'Auto Leaders 900C'},
                                {name: 'Auto Leaders 900E'},
                                {name: 'BCE FM One'},
                                {name: 'BCE FM Light'},
                                {name: 'BCE FM Blue'},
                                {name: 'BCE FM Tacho'},
                                {name: 'BITREK series'},
                                {name: 'Bofan PT80'},
                                {name: 'Bofan PT100'},
                                {name: 'Bofan PT200'},
                                {name: 'Bofan PT201'},
                                {name: 'Bofan PT300X'},
                                {name: 'Bofan PT500'},
                                {name: 'Bofan PT502'},
                                {name: 'Bofan PT600X'},
                                {name: 'BS Technotronics BSTPL-14'},
                                {name: 'BS Technotronics BSTPL-15'},
                                {name: 'C2STEK'},
                                {name: 'Calamp LMU-300'},
                                {name: 'Calamp LMU-400'},
                                {name: 'Calamp LMU-700'},
                                {name: 'Calamp LMU-800'},
                                {name: 'Calamp LMU-900'},
                                {name: 'Calamp LMU-1100'},
                                {name: 'Calamp LMU-1200'},
                                {name: 'Calamp LMU-2000'},
                                {name: 'Calamp LMU-2100'},
                                {name: 'Calamp LMU-2600'},
                                {name: 'Calamp LMU-2700'},
                                {name: 'Calamp LMU-3030'},
                                {name: 'Calamp LMU-4200'},
                                {name: 'Calamp LMU-4520'},
                                {name: 'Calamp LMU-5000'},
                                {name: 'Careu Ueco'},
                                {name: 'Carrideo micro GPS'},
                                {name: 'Castel OBD'},
                                {name: 'Castel SAT-802'},
                                {name: 'Coban GPS102'},
                                {name: 'Coban GPS103'},
                                {name: 'Coban GPS104'},
                                {name: 'Coban GPS105'},
                                {name: 'Coban GPS106'},
                                {name: 'Coban GPS107'},
                                {name: 'Coban GPS301'},
                                {name: 'Coban GPS302'},
                                {name: 'Coban GPS303'},
                                {name: 'Coban GPS304'},
                                {name: 'Coban GPS305'},
                                {name: 'Coban GPS306'},
                                {name: 'Concox ET100'},
                                {name: 'Concox GS503'},
                                {name: 'Concox GT02'},
                                {name: 'Concox GT03'},
                                {name: 'Concox GT03A'},
                                {name: 'Concox GT03B'},
                                {name: 'Concox GT06'},
                                {name: 'Concox GT06N'},
                                {name: 'Concox GT07'},
                                {name: 'Concox GT100'},
                                {name: 'Concox GT300'},
                                {name: 'Concox GT710'},
                                {name: 'Concox GT800'},
                                {name: 'Concox Qbit'},
                                {name: 'Concox TR02'},
                                {name: 'Concox WeTrack 2'},
                                {name: 'Concox X1'},
                                {name: 'China Radio CRT806'},
                                {name: 'China Radio CRT809'},
                                {name: 'China Radio CRT19N'},
                                {name: 'Cybergraphy G200S'},
                                {name: 'Cybergraphy G200X'},
                                {name: 'DCT Syrus'},
                                {name: 'Detero series'},
                                {name: 'Digital Systems DSF10'},
                                {name: 'Digital Systems DSF20'},
                                {name: 'Digital Systems DSF21'},
                                {name: 'Digital Systems DSF22'},
                                {name: 'Digital Systems DSF30'},
                                {name: 'Disha'},
                                {name: 'EELINK GOT08'},
                                {name: 'EELINK GOT10'},
                                {name: 'EELINK GPT06'},
                                {name: 'EELINK K6'},
                                {name: 'EELINK K9+'},
                                {name: 'EELINK K20'},
                                {name: 'EELINK TK115'},
                                {name: 'EELINK TK116'},
                                {name: 'EELINK TK119'},
                                {name: 'Falcom STEPPIII'},
                                {name: 'Fifotrack A100'},
                                {name: 'Fifotrack A200'},
                                {name: 'Fifotrack A300'},
                                {name: 'Fifotrack Q1'},
                                {name: 'Flextrack Lommy'},
                                {name: 'GalileoSky Galileo'},
                                {name: 'Gator M508'},
                                {name: 'Gator M518'},
                                {name: 'Gator M528'},
                                {name: 'Gator M588N'},
                                {name: 'Gator M588S'},
                                {name: 'Geneko Fox Easy'},
                                {name: 'Geneko Fox Lite'},
                                {name: 'Geneko Fox Advanced'},
                                {name: 'GlobalSat GTR128'},
                                {name: 'GlobalSat GTR129'},
                                {name: 'GlobalSat TR102'},
                                {name: 'GlobalSat TR151'},
                                {name: 'GlobalSat TR203'},
                                {name: 'GlobalSat TR206'},
                                {name: 'GlobalSat TR600'},
                                {name: 'Gosafe G2P'},
                                {name: 'Gosafe G1S'},
                                {name: 'Gosafe G3A'},
                                {name: 'Gosafe G3S'},
                                {name: 'Gosafe G6S'},
                                {name: 'Gosafe G626I'},
                                {name: 'Gosafe G71'},
                                {name: 'Gosafe G717'},
                                {name: 'Gosafe G737'},
                                {name: 'Gosafe G777'},
                                {name: 'Gosafe G787'},
                                {name: 'Gosafe G797'},
                                {name: 'GoTop'},
                                {name: 'Haicom HI-602X'},
                                {name: 'Haicom HI-602X'},
                                {name: 'Haicom HI-603X'},
                                {name: 'Haicom HI-604X'},
                                {name: 'Haicom HI-605X'},
                                {name: 'Inteliot IT100'},
                                {name: 'Inteliot IT200'},
                                {name: 'IntelliTrac X1'},
                                {name: 'Internex IGT100'},
                                {name: 'iStartek VT202'},
                                {name: 'iStartek VT206'},
                                {name: 'iStartek VT600'},
                                {name: 'i-Trac A1'},
                                {name: 'i-Trac GTLT3'},
                                {name: 'i-Trac MT-1'},
                                {name: 'i-Trac MT-1C'},
                                {name: 'i-Trac MT-1X'},
                                {name: 'Jointech GP4000'},
                                {name: 'Jointech GP5000'},
                                {name: 'Jointech GP6000'},
                                {name: 'Jointech GP6000F'},
                                {name: 'Jointech JT600'},
                                {name: 'Jointech JT701'},
                                {name: 'jTrack CT101'},
                                {name: 'Keson KS668'},
                                {name: 'KHD KC200'},
                                {name: 'KHD KG100'},
                                {name: 'KHD KG200'},
                                {name: 'KHD KG300'},
                                {name: 'KH-M100A'},
                                {name: 'Maestro MicroTracker'},
                                {name: 'Mastrack MT-OBD'},
                                {name: 'Maxepor MW-B4'},
                                {name: 'Maxepor MW-B7'},
                                {name: 'Maxepor MW-C10'},
                                {name: 'Maxepor MW-G01'},
                                {name: 'Maxepor MW-T1'},
                                {name: 'Megastek GMT-368'},
                                {name: 'Megastek GMT-368SQ'},
                                {name: 'Megastek GPT-69'},
                                {name: 'Megastek GT-89'},
                                {name: 'Megastek GT-99'},
                                {name: 'Megastek GVT-369'},
                                {name: 'Megastek GVT-390'},
                                {name: 'Megastek GVT-500'},
                                {name: 'Megastek GVT-510'},
                                {name: 'Megastek GVT-800'},
                                {name: 'Megastek MT-100'},
                                {name: 'Megastek MT-90'},
                                {name: 'Megastek XT-007'},
                                {name: 'Meiligao GT30i'},
                                {name: 'Meiligao GT60'},
                                {name: 'Meiligao VT300'},
                                {name: 'Meiligao VT310'},
                                {name: 'Meiligao VT400'},
                                {name: 'Meitrack MVT100'},
                                {name: 'Meitrack MVT340'},
                                {name: 'Meitrack MVT380'},
                                {name: 'Meitrack MVT600'},
                                {name: 'Meitrack MVT800'},
                                {name: 'Meitrack MT88'},
                                {name: 'Meitrack MT90'},
                                {name: 'Meitrack MT80i'},
                                {name: 'Meitrack P99G'},
                                {name: 'Meitrack T1'},
                                {name: 'Meitrack T322'},
                                {name: 'Meitrack T333'},
                                {name: 'Meitrack T355'},
                                {name: 'Meitrack T622'},
                                {name: 'Meitrack TC68'},
                                {name: 'Meitrack TC68S'},
                                {name: 'Mictrack MC300'},
                                {name: 'Mictrack MP10'},
                                {name: 'Mictrack MP80'},
                                {name: 'Mictrack MP90'},
                                {name: 'Mictrack MT500'},
                                {name: 'Mictrack MT510'},
                                {name: 'Mictrack MT550'},
                                {name: 'Mictrack MT600'},        
                                {name: 'MiniFinder Atto'},
                                {name: 'MiniFinder Pico'},
                                {name: 'Minova miTrack-II Basic'},
                                {name: 'Minova miTrack-II Plus'},
                                {name: 'M-Plata M100'},
                                {name: 'M-Plata T150'},
                                {name: 'Navtelecom Smart'},
                                {name: 'Noran NR006'},
                                {name: 'Noran NR008'},
                                {name: 'Noran NR024'},
                                {name: 'Noran NR028'},
                                {name: 'Noran NR100'},
                                {name: 'Noran NR108'},
                                {name: 'Oigo Telematics MG series'},
                                {name: 'OKO АВТО-2'},
                                {name: 'OKO NAVI-8C'},
                                {name: 'Oner series'},
                                {name: 'Orion Technology OBDtrac'},
                                {name: 'Orion Technology Easytrac mini'},
                                {name: 'Orion Technology Easytrac'},                                
                                {name: 'Pointer Cellocator CR200'},
                                {name: 'Pointer Cellocator Cello-F'},
                                {name: 'Pretrace TC55'},
                                {name: 'Pretrace TC56'},
                                {name: 'Pretrace TC80'},
                                {name: 'Pretrace TC85'},
                                {name: 'Pretrace TC85D'},
                                {name: 'Queclink GB100'},
                                {name: 'Queclink GL200'},
                                {name: 'Queclink GL300'},
                                {name: 'Queclink GL300W'},
                                {name: 'Queclink GL500'},
                                {name: 'Queclink GL505'},
                                {name: 'Queclink GMT100'},
                                {name: 'Queclink GMT200'},
                                {name: 'Queclink GS100'},
                                {name: 'Queclink GT200'},
                                {name: 'Queclink GT300'},
                                {name: 'Queclink GT301'},
                                {name: 'Queclink GT500'},
                                {name: 'Queclink GV200/G'},
                                {name: 'Queclink GV300'},
                                {name: 'Queclink GV300W'},
                                {name: 'Queclink GV500'},
                                {name: 'Queclink GV55/LITE'},
                                {name: 'Queclink GV65/LITE'},
                                {name: 'Queclink GV75'},
                                {name: 'Queclink GV75W'},
                                {name: 'Queclink TRS'},
                                {name: 'Raveon RV-M7 GX'},
                                {name: 'Roadsay RS3000'},
                                {name: 'Roadsay RS3000S'},
                                {name: 'Ruptela FM-Eco3'},
                                {name: 'Ruptela FM-Pro3'},
                                {name: 'Ruptela FM-Pro3-R'},
                                {name: 'Ruptela FM-Pro4'},
                                {name: 'Ruptela FM-Plug4'},
                                {name: 'Ruptela FM-Plug4+'},
                                {name: 'Ruptela FM-Tco3'},                              
                                {name: 'Ruptela FM-Tco4'},
                                {name: 'Ruptela Trailer Tracker'},
                                {name: 'Sanav CT24'},
                                {name: 'Sanav CT58'},
                                {name: 'Sanav GC-101'},
                                {name: 'Sanav MU-201'},
                                {name: 'Satellite Solutions SAT-LITE'},
                                {name: 'Satellite Solutions SAT-LITE 2'},
                                {name: 'Satellite Solutions SAT-PRO'},
                                {name: 'Satellite Solutions SUPER-LITE'},
                                {name: 'Silicon Techlabs STL060'},
                                {name: 'SIWI'},
                                {name: 'Skypatrol TT8750'},
                                {name: 'SkyTrack JB101'},
                                {name: 'Suntech ST200'},
                                {name: 'Suntech ST210'},
                                {name: 'Suntech ST215'},
                                {name: 'Suntech ST300'},
                                {name: 'Suntech ST330'},
                                {name: 'Suntech ST340'},
                                {name: 'Suntech ST350'},
                                {name: 'Suntech ST600'},
                                {name: 'Suntech ST650'},
                                {name: 'Suntech ST910'},
                                {name: 'Suntech ST940'},
                                {name: 'TelcomIP Patrol Scan'},
                                {name: 'Teltonika AT1000'},
                                {name: 'Teltonika AT1200'},
                                {name: 'Teltonika FM1000'},
                                {name: 'Teltonika FM1010'},
                                {name: 'Teltonika FM1100'},
                                {name: 'Teltonika FM1110'},
                                {name: 'Teltonika FM1120'},
                                {name: 'Teltonika FM1122'},
                                {name: 'Teltonika FM1125'},
                                {name: 'Teltonika FM1200'},
                                {name: 'Teltonika FM1202'},
                                {name: 'Teltonika FM1204'},
                                {name: 'Teltonika FM2200'},
                                {name: 'Teltonika FM3200'},
                                {name: 'Teltonika FM3300'},
                                {name: 'Teltonika FM3400'},
                                {name: 'Teltonika FM3600'},
                                {name: 'Teltonika FM3620'},
                                {name: 'Teltonika FM3622'},
                                {name: 'Teltonika FM4100'},
                                {name: 'Teltonika FM4200'},
                                {name: 'Teltonika FM5300'},
                                {name: 'Teltonika FM5500'},
                                {name: 'Teltonika FM6320'},
                                {name: 'Teltonika FMA110'},
                                {name: 'Teltonika FMA120'},
                                {name: 'Teltonika FMA202'},
                                {name: 'Teltonika FMA204'},
                                {name: 'Teltonika FMB001'},
                                {name: 'Teltonika FMB010'},
                                {name: 'Teltonika FMB120'},
                                {name: 'Teltonika FMB122'},
                                {name: 'Teltonika FMB125'},
                                {name: 'Teltonika FMB630'},
                                {name: 'Teltonika FMB900'},
                                {name: 'Teltonika FMB920'},
                                {name: 'Teltonika GH1202'},
                                {name: 'Teltonika GH3000'},
                                {name: 'Teltonika GH4000'},
                                {name: 'Teltonika RUT955'},
                                {name: 'Thinkpower TP303'},
                                {name: 'Thinkpower VP203'},
                                {name: 'TKSTAR XE103'},
                                {name: 'TKSTAR XE108'},
                                {name: 'TKSTAR XE120'},
                                {name: 'TKSTAR XE201'},
                                {name: 'TKSTAR XE209'},
                                {name: 'TLT-2H'},
                                {name: 'Topflytech T8603'},
                                {name: 'Topflytech T8801'},
                                {name: 'Topflytech T8802'},
                                {name: 'Topflytech T8803'},
                                {name: 'Topflytech T8803 Pro'},
                                {name: 'Topflytech T8806'},
                                {name: 'Topflytech T8808'},
                                {name: 'Totem Tech AT03'},
                                {name: 'Totem Tech AT05'},
                                {name: 'Totem Tech AT06'},
                                {name: 'Totem Tech AT07'},
                                {name: 'Totem Tech AT09'},
                                {name: 'Topin'},
                                {name: 'TopTen'},
                                {name: 'Tracer X2'},
                                {name: 'TrackPro TR20'},
                                {name: 'TrackPro TR60'},
                                {name: 'TWIG'},
                                {name: 'Tracker Technology AVL115'},
                                {name: 'Tracker Technology AVL520'},
                                {name: 'Tracker Technology GAB2'},
                                {name: 'Tracker Technology K7'},
                                {name: 'Tracker Technology MPS320'},
                                {name: 'Tracker Technology MPS340'},
                                {name: 'Tracker Technology MPS350'},
                                {name: 'Tytan SAT DS520'},
                                {name: 'Tytan SAT DS530'},
                                {name: 'Tytan SAT DS540'},
                                {name: 'TZone Digital AVL02'},
                                {name: 'TZone Digital AVL03'},
                                {name: 'TZone Digital AVL05'},
                                {name: 'TZone Digital AVL08'},
                                {name: 'Ulbotech T3XX series'},
                                {name: 'Uniguard series'},
                                {name: 'Unknown 056'},
                                {name: 'Unknown 807RF'},
                                {name: 'Unknown CCTR-800'},
                                {name: 'Unknown CCTR-801'},
                                {name: 'Unknown CCTR-803'},
                                {name: 'Unknown CCTR-808S'},
                                {name: 'Unknown CCTR-810'},
                                {name: 'Unknown G64'},
                                {name: 'Unknown GM908'},
                                {name: 'Unknown GP106M'},
                                {name: 'Unknown GPST1086'},
                                {name: 'Unknown GT02'},
                                {name: 'Unknown GT03'},
                                {name: 'Unknown HW18'},
                                {name: 'Unknown M60'},
                                {name: 'Unknown PG88'},
                                {name: 'Unknown PolGPS1'},
                                {name: 'Unknown PT3000'},
                                {name: 'Unknown STL060'},
                                {name: 'Unknown T18'},
                                {name: 'Unknown T0024'},
                                {name: 'Unknown TK102'},
                                {name: 'Unknown TK103'},
                                {name: 'Unknown TK106'},
                                {name: 'Unknown TK110'},
                                {name: 'Unknown TK20G'},
                                {name: 'Unknown TK206OBD'},
                                {name: 'Unknown TL206'},
                                {name: 'Unknown TR10'},
                                {name: 'Unknown VT206'},
                                {name: 'Unknown WB-1G'},
                                {name: 'Visiontek 84VTU'},
                                {name: 'Visiontek 86VTU'},
                                {name: 'Visiontek 87VTU'},
                                {name: 'Virus Platinum'},
                                {name: 'Wialon IPS'},
                                {name: 'XEXUN TK102/TK102-2'},
                                {name: 'XEXUN TK103/TK103-2'},
                                {name: 'XEXUN TK107'},
                                {name: 'XEXUN TK201'},
                                {name: 'XEXUN TK202'},
                                {name: 'XEXUN TK203'},
                                {name: 'XEXUN XT008'},
                                {name: 'XEXUN XT009'},
                                {name: 'XEXUN XT013'},
                                {name: 'Yuwei YW3000'},
                                {name: 'Zenda ZD-VT2'},
                                {name: 'Mobile (Android)'},
                                {name: 'Mobile (BlackBerry)'},
                                {name: 'Mobile (iOS)'},
                                {name: 'Mobile (Windows Phone)'},
                                {name: 'Other'}
                                ];