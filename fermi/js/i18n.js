// N4: Nederlands en Engels.

const STRINGS = {
  nl: {
    appTagline: 'Elk potje een karakter',
    navToday: 'Vandaag', navShelf: 'Plank', navNew: 'Nieuw', navDex: 'Fermidex', navMore: 'Meer',
    // Vandaag
    todayTitle: 'Vandaag', todayNeeds: 'Nu aandacht nodig', todayLater: 'Straks', todayCalm: 'Rustig aan het borrelen',
    todayAllGood: 'Alles is blij. Geen potje heeft nu iets nodig.', todayEmpty: 'Nog geen potjes. Zet je eerste ferment in!',
    startFirst: 'Eerste potje starten', streak: '{n} dagen op tijd geburpt',
    // taken
    task_burp: 'Burpen', task_shake: 'Schudden', task_check: 'Maandelijkse check', task_taste: 'Proeven',
    task_harvest: 'Oogstklaar', task_overdue: 'Over tijd: proeven of oogsten',
    doBurp: 'Geburpt', doShake: 'Geschud', doCheck: 'Gecheckt', doTaste: 'Proeven', doHarvest: 'Oogsten',
    lateBy: '{t} te laat', dueIn: 'over {t}', dueAt: 'om {t}', pressureWarn: 'Druk loopt op in de fles. Nu burpen.',
    // status (N3: altijd ook tekst)
    stage_active: 'Actief', stage_tasteReady: 'Proefklaar', stage_harvestReady: 'Oogstklaar', stage_overdue: 'Over tijd',
    status_fridge: 'In de koelkast', status_done: 'Op',
    mood_sleepy: 'Slaperig: net gestart', mood_happy: 'Blij en bruisend', mood_bloated: 'Opgeblazen: wil burpen',
    mood_stressed: 'Benauwd: burp is te laat', mood_curious: 'Nieuwsgierig: proef me!', mood_proud: 'Trots: oogstklaar',
    mood_tired: 'Moe: over tijd', mood_retired: 'Met pensioen in de koelkast',
    day: 'dag', days: 'dagen', hour: 'uur', hours: 'uur', min: 'min',
    dayOf: 'Dag {d} van {min}–{max}', hourOf: 'Uur {d} van {min}–{max}',
    // Plank
    shelfTitle: 'Plank', shelfEmpty: 'De plank is nog leeg.', shelfFridge: 'Koelkast',
    // Nieuw
    newTitle: 'Nieuw potje', step: 'Stap {n} van 2', pickTemplate: 'Kies een ferment',
    filterAll: 'Alles', filterContinent: 'Werelddeel', filterDifficulty: 'Moeilijkheid',
    continent_europe: 'Europa', continent_asia: 'Azië', continent_africa: 'Afrika', continent_americas: 'Amerika', continent_world: 'Wereldwijd',
    difficulty_1: 'Makkelijk', difficulty_2: 'Gemiddeld', difficulty_3: 'Gevorderd',
    myTemplates: 'Mijn templates', info: 'Info',
    fName: 'Naam', fNameShuffle: 'Andere naam', fStart: 'Startdatum en tijd', fVolume: 'Inhoud (liter)', fPhoto: 'Foto (optioneel)',
    fSalt: 'Zoutpercentage', fVeg: 'Groente / fruit (gram)', fWater: 'Water (gram)', fSaltNeeded: 'Benodigd zout: {g} g',
    fBrineHint: 'Pekel: vul ook het water in.', fTemp: 'Omgevingstemperatuur (°C)', fDuration: 'Doelduur',
    fMinDays: 'Min. dagen', fMaxDays: 'Max. dagen', fMinHours: 'Min. uren', fMaxHours: 'Max. uren',
    fTempEffect: 'Bij {t} °C verwacht: {range}', create: 'Potje starten', back: 'Terug', next: 'Volgende',
    saltLow: 'Let op: {p}% is onder de veilige ondergrens van {min}% voor dit ferment. Te weinig zout geeft ongewenste bacteriën vrij spel.',
    saltHigh: 'Dit is veel zout ({p}%). Niet gevaarlijk, maar fermentatie gaat trager en het wordt erg zout.',
    burpPlan: 'Ritme', burpEvery: '{verb} elke {t}', burpNone: 'Niet burpen (doek of luchtig afgedekt)',
    vegTip: 'Tip: houd alles onder de pekel met een gewicht (glazen gewichtje, zakje pekel of koolblad). Wat boven de pekel uitsteekt kan schimmelen.',
    // Detail
    burpNow: '{verb}', lastBurp: 'Laatst: {t}', nextBurp: 'Volgende: {t}', noBurp: 'Geen burp nodig',
    logTitle: 'Logboek', addNote: 'Notitie', addTaste: 'Proeven', addObs: 'Observatie', addPhoto: 'Foto',
    harvestTitle: 'Oogsten', harvestText: 'Het potje gaat met pensioen in de koelkast.', bestBefore: 'Houdbaar tot {d}',
    rating: 'Hoe lekker? (1–5)', confirmHarvest: 'Naar de koelkast', nextPhase: 'Start {name}',
    nextPhaseText: 'Klaar met de eerste fase? Bottel en start de tweede fase: zelfde karakter, nieuwe klok.',
    saveTemplate: 'Bewaar als eigen template', templateName: 'Naam van je template', saved: 'Opgeslagen',
    finish: 'Op / weggooien', deleteJar: 'Verwijderen', confirmDelete: 'Dit potje definitief verwijderen?',
    edit: 'Bewerken', save: 'Opslaan', cancel: 'Annuleren', close: 'Sluiten', repeat: 'Herhaal recept',
    tasteText: 'Hoe smaakt het?', tasteDecision: 'En nu?', keepGoing: 'Langer laten staan', harvestNow: 'Oogsten',
    note: 'Notitie', obsTitle: 'Wat zie, ruik je?',
    obs_bubbles: 'Bubbels', obs_sourSmell: 'Frisse zure geur', obs_cloudy: 'Troebel', obs_kahm: 'Wit vlies (kahm?)',
    obs_mold: 'Pluizig / gekleurd (schimmel?)', obs_offSmell: 'Rotte / vieze geur', obs_soft: 'Zacht / slijmerig',
    ev_harvest: 'Geoogst', ev_phase: 'Tweede fase gestart', ev_created: 'Gestart',
    temp: 'Temperatuur', salt: 'Zout', volume: 'Inhoud', started: 'Gestart', harvested: 'Geoogst', duration: 'Duur',
    // Veiligheid (V1, V4): hier praat het karakter niet
    safetyTitle: 'Kahm of schimmel?', safetyIntro: 'Bij twijfel: weggooien. Deze checker geeft richtlijnen, geen garantie.',
    kahmTitle: 'Kahm-gist', kahmDesc: 'Plat, wit tot crèmekleurig vlies, vaak gerimpeld of als een dun laagje. Onschuldig, maar kan de smaak beïnvloeden. Schep het eraf, houd de groente onder de pekel.',
    moldTitle: 'Schimmel', moldDesc: 'Pluizig, harig of verheven plekjes. Gekleurd: blauw, groen, zwart, roze of oranje. Weggooien, ook wat eronder zit.',
    q1: 'Is het pluizig of harig?', q2: 'Heeft het kleur (blauw, groen, zwart, roze, oranje)?', q3: 'Is het plat, wit en glad of gerimpeld?',
    yes: 'Ja', no: 'Nee', unsure: 'Weet ik niet',
    verdictMold: 'Waarschijnlijk schimmel. Gooi het potje weg. Niet proeven.',
    verdictKahm: 'Waarschijnlijk kahm. Onschuldig: schep het eraf en houd alles onder de pekel.',
    verdictUnsure: 'Niet zeker? Weggooien is altijd de veilige keuze.',
    moldAlert: 'Je meldt mogelijke schimmel of een rotte geur. Gooi het potje weg bij twijfel en proef het niet.',
    openChecker: 'Open de kahm/schimmel-checker',
    disclaimer: 'Fermi geeft richtlijnen, geen voedselveiligheidsgarantie. Ziet, ruikt of voelt iets verkeerd: bij twijfel weggooien.',
    templateDisclaimer: 'Richtwaarden bij ca. 20 °C uit vakkennis; nog niet per bron geverifieerd.',
    // Fermidex & badges
    dexTitle: 'Fermidex', dexIntro: 'Oogst een ferment om het te ontgrendelen.', dexLocked: 'Nog niet ontgrendeld',
    badgesTitle: 'Badges', archiveTitle: 'Archief', archiveEmpty: 'Nog geen afgeronde batches.', bestBatches: 'Lekkerste batches',
    badge_firstJar: 'Eerste potje', badge_firstJar_d: 'Je eerste ferment staat op de plank.',
    badge_firstHarvest: 'Eerste oogst', badge_firstHarvest_d: 'Een potje succesvol geoogst.',
    badge_streak7: 'Burp-held', badge_streak7_d: '7 dagen alles op tijd geburpt.',
    badge_burps50: 'Windmaker', badge_burps50_d: '50 keer geburpt.',
    badge_collector5: 'Verzamelaar', badge_collector5_d: '5 soorten in je Fermidex.',
    badge_secondPhase: 'Bruisbaas', badge_secondPhase_d: 'Een tweede fase afgerond.',
    badge_patient: 'Zen-meester', badge_patient_d: 'Een lang ferment (miso) geoogst.',
    badge_world: 'Wereldfermenteerder', badge_world_d: 'Een ferment uit Europa, Azië, Afrika en Amerika.',
    // Meer / instellingen
    moreTitle: 'Meer', settingsTitle: 'Instellingen', language: 'Taal',
    notifications: 'Meldingen', notifEnable: 'Meldingen aanzetten', notifOn: 'Meldingen staan aan', notifDenied: 'Meldingen zijn geblokkeerd in je browser.',
    notifUnsupported: 'Deze browser ondersteunt geen meldingen.', notifTest: 'Testmelding',
    notifHow: 'Meldingen worden lokaal op dit apparaat ingepland, zonder server. Installeer Fermi op je beginscherm voor de beste betrouwbaarheid.',
    quietHours: 'Stil-uur', quietFrom: 'Van', quietTo: 'Tot', urgentInQuiet: 'Dringende drukwaarschuwing (F2-flessen) ook in stil-uur',
    data: 'Jouw data', exportCsv: 'Logboek exporteren (CSV)', exportJson: 'Back-up maken (JSON)', importJson: 'Back-up terugzetten',
    importOk: 'Back-up teruggezet.', importFail: 'Dit bestand kon niet gelezen worden.', loadDemo: 'Demo-potjes laden',
    about: 'Over Fermi', notifBody_burp: '{name} wil even burpen.', notifBody_shake: '{name} wil geschud worden.',
    notifBody_check: 'Tijd voor de maandelijkse check van {name}.', notifBody_taste: '{name} is klaar om te proeven.',
    notifBody_harvest: '{name} is oogstklaar!', notifUrgent: 'Dringend: druk in {name}. Burp de fles nu.',
    burped: '{name} is geburpt', undo: 'Ongedaan maken', welcomeTitle: 'Welkom bij Fermi',
    welcomeText: 'Elk fermentatiepotje wordt een karakter dat laat zien wat het nodig heeft: burpen, proeven, oogsten. Niks gaat dood; fermentatie is vergevingsgezind, Fermi ook.',
    welcomeOk: 'Begrepen, aan de slag', installHint: 'Tip: voeg Fermi toe aan je beginscherm.',
    ago: '{t} geleden', now: 'nu', never: 'nog niet', of: 'van',
    customTitle: 'Eigen ferment', customCardSub: 'Kies zelf groente en specerijen; Fermi maakt het karakter',
    cVeg: 'Groenten', cVegSearch: 'Zoek een groente', cVegHint: 'De zwaarste groente wordt de hoofdgroente.',
    cMain: 'Hoofdgroente', cWeight: 'Gewicht (g)', cAddFree: '“{name}” toevoegen als', cRemove: 'Verwijderen', cNoMatch: 'Staat je groente er niet bij? Kies de soort:',
    cat_cabbage: 'Kool', cat_root: 'Knol / wortel', cat_fruit: 'Vrucht', cat_leaf: 'Blad', cat_legume: 'Peulvrucht',
    hard_1: 'zacht', hard_2: 'stevig', hard_3: 'hard', sugar_0: 'weinig suiker', sugar_1: 'wat suiker', sugar_2: 'suikerrijk',
    seasonNow: 'Nu in seizoen', seasonOut: 'Buiten seizoen ({range})', seasonAll: 'Hele jaar', seasonUnknown: 'Seizoen onbekend',
    cSpices: 'Specerijen en kruiden', cSpiceFree: 'Eigen specerij of kruid', cAdd: 'Toevoegen', cAmount: 'Hoeveelheid (optioneel)',
    cPlan: 'Voorstel', cPlanHint: 'Afgeleid uit je groenten. Pas gerust alles aan.', cMethod: 'Methode',
    method_dry: 'Droog zouten', method_brine: 'Pekel', methodWhy_dry: 'Kool en bladgroente trekken met zout hun eigen vocht en maken zo hun eigen pekel.',
    methodWhy_brine: 'Harde groente en vruchten geven te weinig vocht af; die gaan onder een pekel.',
    cBurpEvery: 'Burpen elke (uur)', cBurpNone: '0 = niet burpen', cReset: 'Herstel voorstel', cTotal: 'Totaal groente: {g} g',
    warnSaltLow: 'Zout onder 2%: te weinig om ongewenste bacteriën tegen te houden. Gebruik minstens 2%.',
    warnFruit: 'Veel zoet fruit ({p}% van het gewicht): de suikers kunnen alcohol en gist geven. Houd het onder ongeveer 25% en proef vaker.',
    warnStarch: 'Zetmeelrijke groente ({names}) wordt snel zacht en kan papperig worden. Kort fermenteren en vroeg proeven.',
    cAvatar: 'Karakter', cRegen: 'Opnieuw genereren', cColor: 'Kleur', cAvatarHint: 'Vorm en kleur komen van je hoofdgroente, de strepen van de tweede groente en de stipjes van je specerijen.',
    cStart: 'Start', cNeedVeg: 'Voeg eerst minstens één groente toe.', recipeTitle: 'Recept', dexOwn: 'Eigen creaties', cRestart: 'Opnieuw beginnen',
  },
  en: {
    appTagline: 'Every jar a character',
    navToday: 'Today', navShelf: 'Shelf', navNew: 'New', navDex: 'Fermidex', navMore: 'More',
    todayTitle: 'Today', todayNeeds: 'Needs attention now', todayLater: 'Coming up', todayCalm: 'Quietly bubbling',
    todayAllGood: 'Everyone is happy. No jar needs anything right now.', todayEmpty: 'No jars yet. Start your first ferment!',
    startFirst: 'Start first jar', streak: '{n} days burped on time',
    task_burp: 'Burp', task_shake: 'Shake', task_check: 'Monthly check', task_taste: 'Taste',
    task_harvest: 'Ready to harvest', task_overdue: 'Overdue: taste or harvest',
    doBurp: 'Burped', doShake: 'Shaken', doCheck: 'Checked', doTaste: 'Taste', doHarvest: 'Harvest',
    lateBy: '{t} late', dueIn: 'in {t}', dueAt: 'at {t}', pressureWarn: 'Pressure is building in the bottle. Burp it now.',
    stage_active: 'Active', stage_tasteReady: 'Ready to taste', stage_harvestReady: 'Ready to harvest', stage_overdue: 'Overdue',
    status_fridge: 'In the fridge', status_done: 'Finished',
    mood_sleepy: 'Sleepy: just started', mood_happy: 'Happy and bubbly', mood_bloated: 'Bloated: wants a burp',
    mood_stressed: 'Stuffy: burp is late', mood_curious: 'Curious: taste me!', mood_proud: 'Proud: ready to harvest',
    mood_tired: 'Tired: overdue', mood_retired: 'Retired to the fridge',
    day: 'day', days: 'days', hour: 'hour', hours: 'hours', min: 'min',
    dayOf: 'Day {d} of {min}–{max}', hourOf: 'Hour {d} of {min}–{max}',
    shelfTitle: 'Shelf', shelfEmpty: 'The shelf is still empty.', shelfFridge: 'Fridge',
    newTitle: 'New jar', step: 'Step {n} of 2', pickTemplate: 'Pick a ferment',
    filterAll: 'All', filterContinent: 'Continent', filterDifficulty: 'Difficulty',
    continent_europe: 'Europe', continent_asia: 'Asia', continent_africa: 'Africa', continent_americas: 'Americas', continent_world: 'Worldwide',
    difficulty_1: 'Easy', difficulty_2: 'Medium', difficulty_3: 'Advanced',
    myTemplates: 'My templates', info: 'Info',
    fName: 'Name', fNameShuffle: 'Other name', fStart: 'Start date and time', fVolume: 'Volume (litres)', fPhoto: 'Photo (optional)',
    fSalt: 'Salt percentage', fVeg: 'Vegetables / fruit (grams)', fWater: 'Water (grams)', fSaltNeeded: 'Salt needed: {g} g',
    fBrineHint: 'Brine: fill in the water too.', fTemp: 'Room temperature (°C)', fDuration: 'Target duration',
    fMinDays: 'Min. days', fMaxDays: 'Max. days', fMinHours: 'Min. hours', fMaxHours: 'Max. hours',
    fTempEffect: 'At {t} °C expect: {range}', create: 'Start jar', back: 'Back', next: 'Next',
    saltLow: 'Careful: {p}% is below the safe minimum of {min}% for this ferment. Too little salt gives unwanted bacteria free rein.',
    saltHigh: 'That is a lot of salt ({p}%). Not dangerous, but fermentation slows down and it gets very salty.',
    burpPlan: 'Rhythm', burpEvery: '{verb} every {t}', burpNone: 'No burping (cloth or loosely covered)',
    vegTip: 'Tip: keep everything under the brine with a weight (glass weight, bag of brine or a cabbage leaf). Anything above the brine can grow mould.',
    burpNow: '{verb}', lastBurp: 'Last: {t}', nextBurp: 'Next: {t}', noBurp: 'No burping needed',
    logTitle: 'Log', addNote: 'Note', addTaste: 'Taste', addObs: 'Observation', addPhoto: 'Photo',
    harvestTitle: 'Harvest', harvestText: 'The jar retires to the fridge.', bestBefore: 'Keeps until {d}',
    rating: 'How tasty? (1–5)', confirmHarvest: 'To the fridge', nextPhase: 'Start {name}',
    nextPhaseText: 'Done with the first phase? Bottle it and start the second phase: same character, new clock.',
    saveTemplate: 'Save as my template', templateName: 'Template name', saved: 'Saved',
    finish: 'Finished / discard', deleteJar: 'Delete', confirmDelete: 'Delete this jar permanently?',
    edit: 'Edit', save: 'Save', cancel: 'Cancel', close: 'Close', repeat: 'Repeat recipe',
    tasteText: 'How does it taste?', tasteDecision: 'What now?', keepGoing: 'Let it go longer', harvestNow: 'Harvest',
    note: 'Note', obsTitle: 'What do you see or smell?',
    obs_bubbles: 'Bubbles', obs_sourSmell: 'Fresh sour smell', obs_cloudy: 'Cloudy', obs_kahm: 'White film (kahm?)',
    obs_mold: 'Fuzzy / coloured (mould?)', obs_offSmell: 'Rotten / foul smell', obs_soft: 'Soft / slimy',
    ev_harvest: 'Harvested', ev_phase: 'Second phase started', ev_created: 'Started',
    temp: 'Temperature', salt: 'Salt', volume: 'Volume', started: 'Started', harvested: 'Harvested', duration: 'Duration',
    safetyTitle: 'Kahm or mould?', safetyIntro: 'When in doubt, throw it out. This checker gives guidance, not a guarantee.',
    kahmTitle: 'Kahm yeast', kahmDesc: 'Flat, white to cream-coloured film, often wrinkly or a thin layer. Harmless, but can affect flavour. Skim it off and keep the vegetables under the brine.',
    moldTitle: 'Mould', moldDesc: 'Fuzzy, hairy or raised spots. Coloured: blue, green, black, pink or orange. Throw it out, including what is underneath.',
    q1: 'Is it fuzzy or hairy?', q2: 'Does it have colour (blue, green, black, pink, orange)?', q3: 'Is it flat, white and smooth or wrinkly?',
    yes: 'Yes', no: 'No', unsure: 'Not sure',
    verdictMold: 'Probably mould. Throw the jar away. Do not taste it.',
    verdictKahm: 'Probably kahm. Harmless: skim it off and keep everything under the brine.',
    verdictUnsure: 'Not sure? Throwing it out is always the safe choice.',
    moldAlert: 'You reported possible mould or a rotten smell. When in doubt, throw the jar away and do not taste it.',
    openChecker: 'Open the kahm/mould checker',
    disclaimer: 'Fermi gives guidance, not a food safety guarantee. If something looks, smells or feels wrong: when in doubt, throw it out.',
    templateDisclaimer: 'Guide values at about 20 °C from common practice; not yet verified per source.',
    dexTitle: 'Fermidex', dexIntro: 'Harvest a ferment to unlock it.', dexLocked: 'Not unlocked yet',
    badgesTitle: 'Badges', archiveTitle: 'Archive', archiveEmpty: 'No finished batches yet.', bestBatches: 'Tastiest batches',
    badge_firstJar: 'First jar', badge_firstJar_d: 'Your first ferment is on the shelf.',
    badge_firstHarvest: 'First harvest', badge_firstHarvest_d: 'Harvested a jar successfully.',
    badge_streak7: 'Burp hero', badge_streak7_d: 'Burped everything on time for 7 days.',
    badge_burps50: 'Wind maker', badge_burps50_d: 'Burped 50 times.',
    badge_collector5: 'Collector', badge_collector5_d: '5 kinds in your Fermidex.',
    badge_secondPhase: 'Fizz boss', badge_secondPhase_d: 'Completed a second phase.',
    badge_patient: 'Zen master', badge_patient_d: 'Harvested a long ferment (miso).',
    badge_world: 'World fermenter', badge_world_d: 'A ferment from Europe, Asia, Africa and the Americas.',
    moreTitle: 'More', settingsTitle: 'Settings', language: 'Language',
    notifications: 'Notifications', notifEnable: 'Turn on notifications', notifOn: 'Notifications are on', notifDenied: 'Notifications are blocked in your browser.',
    notifUnsupported: 'This browser does not support notifications.', notifTest: 'Test notification',
    notifHow: 'Notifications are scheduled locally on this device, no server involved. Install Fermi to your home screen for the best reliability.',
    quietHours: 'Quiet hours', quietFrom: 'From', quietTo: 'Until', urgentInQuiet: 'Urgent pressure warning (F2 bottles) during quiet hours too',
    data: 'Your data', exportCsv: 'Export log (CSV)', exportJson: 'Make a backup (JSON)', importJson: 'Restore a backup',
    importOk: 'Backup restored.', importFail: 'This file could not be read.', loadDemo: 'Load demo jars',
    about: 'About Fermi', notifBody_burp: '{name} would like a burp.', notifBody_shake: '{name} wants a shake.',
    notifBody_check: 'Time for the monthly check of {name}.', notifBody_taste: '{name} is ready to taste.',
    notifBody_harvest: '{name} is ready to harvest!', notifUrgent: 'Urgent: pressure in {name}. Burp the bottle now.',
    burped: '{name} burped', undo: 'Undo', welcomeTitle: 'Welcome to Fermi',
    welcomeText: 'Every fermentation jar becomes a character that shows what it needs: burping, tasting, harvesting. Nothing dies; fermentation is forgiving, and so is Fermi.',
    welcomeOk: 'Got it, let\'s go', installHint: 'Tip: add Fermi to your home screen.',
    ago: '{t} ago', now: 'now', never: 'not yet', of: 'of',
    customTitle: 'Own ferment', customCardSub: 'Pick your own vegetables and spices; Fermi makes the character',
    cVeg: 'Vegetables', cVegSearch: 'Search a vegetable', cVegHint: 'The heaviest vegetable becomes the main one.',
    cMain: 'Main vegetable', cWeight: 'Weight (g)', cAddFree: 'Add “{name}” as', cRemove: 'Remove', cNoMatch: 'Vegetable not listed? Pick its kind:',
    cat_cabbage: 'Cabbage', cat_root: 'Root / tuber', cat_fruit: 'Fruit', cat_leaf: 'Leaf', cat_legume: 'Legume',
    hard_1: 'soft', hard_2: 'firm', hard_3: 'hard', sugar_0: 'low sugar', sugar_1: 'some sugar', sugar_2: 'sugary',
    seasonNow: 'In season now', seasonOut: 'Out of season ({range})', seasonAll: 'All year', seasonUnknown: 'Season unknown',
    cSpices: 'Spices and herbs', cSpiceFree: 'Your own spice or herb', cAdd: 'Add', cAmount: 'Amount (optional)',
    cPlan: 'Proposal', cPlanHint: 'Derived from your vegetables. Feel free to change anything.', cMethod: 'Method',
    method_dry: 'Dry salting', method_brine: 'Brine', methodWhy_dry: 'Cabbage and leafy greens release their own juice with salt and make their own brine.',
    methodWhy_brine: 'Hard vegetables and fruit release too little juice, so they go under a brine.',
    cBurpEvery: 'Burp every (hours)', cBurpNone: '0 = no burping', cReset: 'Restore proposal', cTotal: 'Total vegetables: {g} g',
    warnSaltLow: 'Salt below 2%: too little to hold back unwanted bacteria. Use at least 2%.',
    warnFruit: 'Lots of sweet fruit ({p}% of the weight): the sugars can turn into alcohol and yeast. Keep it under about 25% and taste more often.',
    warnStarch: 'Starchy vegetables ({names}) soften quickly and can turn mushy. Ferment briefly and taste early.',
    cAvatar: 'Character', cRegen: 'Generate again', cColor: 'Colour', cAvatarHint: 'Shape and colour come from your main vegetable, the stripes from the second one and the dots from your spices.',
    cStart: 'Start', cNeedVeg: 'Add at least one vegetable first.', recipeTitle: 'Recipe', dexOwn: 'Own creations', cRestart: 'Start over',
  },
};

let lang = 'nl';

export function setLang(l) {
  lang = STRINGS[l] ? l : 'nl';
  document.documentElement.lang = lang;
}
export const getLang = () => lang;
export const LANGS = Object.keys(STRINGS);

export function t(key, vars = {}) {
  const s = STRINGS[lang][key] ?? STRINGS.nl[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`));
}

// Tekst uit een template-object { nl, en }.
export const tl = (obj) => (obj ? obj[lang] ?? obj.nl : '');

export function fmtDuration(h) {
  const a = Math.abs(h);
  if (a < 1) return `${Math.max(1, Math.round(a * 60))} ${t('min')}`;
  if (a < 48) return `${Math.round(a)} ${t('hours')}`;
  const d = Math.round(a / 24);
  return `${d} ${d === 1 ? t('day') : t('days')}`;
}

export function fmtRange(minH, maxH) {
  if (maxH < 48) return `${Math.round(minH)}–${Math.round(maxH)} ${t('hours')}`;
  return `${Math.round(minH / 24)}–${Math.round(maxH / 24)} ${t('days')}`;
}

const locale = () => (lang === 'nl' ? 'nl-NL' : 'en-GB');

export function fmtTime(ms) {
  return new Date(ms).toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
}

export function fmtDate(ms, withTime = false) {
  const o = { day: 'numeric', month: 'short', year: 'numeric' };
  if (withTime) Object.assign(o, { hour: '2-digit', minute: '2-digit' });
  return new Date(ms).toLocaleString(locale(), o);
}

// "om 14:00", "morgen 09:00" of een datum.
export function fmtWhen(ms, now = Date.now()) {
  const d = new Date(ms);
  const n = new Date(now);
  const sameDay = d.toDateString() === n.toDateString();
  if (sameDay) return fmtTime(ms);
  const tomorrow = new Date(now + 864e5).toDateString() === d.toDateString();
  if (tomorrow) return `${lang === 'nl' ? 'morgen' : 'tomorrow'} ${fmtTime(ms)}`;
  return fmtDate(ms, Math.abs(ms - now) < 7 * 864e5);
}

export function monthName(m) {
  return new Date(2026, m - 1, 1).toLocaleString(lang === 'nl' ? 'nl-NL' : 'en-GB', { month: 'short' }).replace('.', '');
}
