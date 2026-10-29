# Fermi

Elk fermentatiepotje wordt een levend karakter dat aandacht vraagt: burpen, proeven, oogsten.
Offline-first PWA zonder buildstap of server.

## Starten

```sh
cd fermi
npm start        # of: python3 -m http.server 8080
npm test         # unit-tests van de fermentatielogica
```

Open http://localhost:8080. Onder **Meer → Demo-potjes laden** zie je alle stemmingen direct.

## Structuur

| Bestand | Inhoud |
| --- | --- |
| `js/templates.js` | 15 fermentatie-templates (zout, duur, burp-ritme, uitleg, fouten), NL/EN |
| `js/logic.js` | Pure logica: status, burp-schema, stemming, urgentie, stil-uur, temperatuur, oogst, F2, badges, CSV |
| `js/ingredients.js` | Eigen ferment: ingrediëntendatabase, specerijen met smaakhint, afleiding van methode/zout/duur/burp, veiligheidscheck, seizoen en avatar |
| `js/characters.js` | SVG-karakter per soort (ook gegenereerde avatars); gezicht en extra's volgen de stemming |
| `js/app.js` | Schermen: Vandaag, Plank, Nieuw (2 stappen), Potje, Fermidex, Archief, Kahm-checker, Meer |
| `js/notify.js` | Lokale meldingen, stil-uur, dringende F2-drukwaarschuwing |
| `js/store.js` | Opslag in `localStorage` |
| `sw.js` | Offline-cache en meldingen met "Geburpt"-actie |

## Requirements-dekking

- **F1–F12**: potje aanmaken met naam, template, start, liter en foto; zoutcalculator; doelduur met aftelbalk
  en status; burp-schema met afvinken in één tik (en ongedaan maken); Vandaag-overzicht op urgentie; meldingen
  met stil-uur; logboek (notitie, smaak 1–5, foto, observaties); oogsten naar koelkast met houdbaarheid; archief
  met herhaal-knop; temperatuur schuift de duur mee (×2 per 10 °C); tweede fase (kombucha F1 → F2); eigen
  template van een batch.
- **Tamagotchi (T1–T6)**: stemming wordt altijd uit data afgeleid (`mood()` in `logic.js`): slaperig, blij,
  opgeblazen (groeit met hoe laat de burp is), benauwd met barstjes in het deksel, nieuwsgierig met lepeltje,
  trots met kroontje, moe en grijs, met pensioen. Plank-weergave, Fermidex, streaks en badges. Niets gaat dood.
- **Templates (K1–K3)**: filter op werelddeel en moeilijkheid, infopagina met "goed" en veelgemaakte fouten,
  miso krijgt een maandelijkse check in plaats van burpen, citroenen worden geschud.
- **Veiligheid (V1–V5)**: kahm/schimmel-checker zonder karakter, zoutwaarschuwing onder de ondergrens, dringende
  F2-drukmelding ook in stil-uur (instelbaar), disclaimer, pekel-gewichttip bij groente-templates.
- **N1–N5**: offline (service worker, lokale opslag), aanmaken in 2 schermen, status altijd ook als tekst,
  NL en EN, CSV-export plus JSON-back-up/terugzetten.

## Eigen ferment (E1–E10)

Via **Nieuw → Eigen ferment** kies je zelf groenten en specerijen.

- **E1/E2**: 34 groenten met categorie, hardheid, suiker en seizoen; ontbreekt je groente, dan kies je de soort en
  gebruikt Fermi de standaardwaarden van die categorie.
- **E3/E4**: meerdere groenten met gewicht (de zwaarste is de hoofdgroente) en specerijen uit een lijst of vrij,
  met optionele hoeveelheid.
- **E5/E6**: kool en blad droog zouten op 2%, overige groente in pekel van 2,5–3% (hard = 3%), zout in gram;
  duur en burp-ritme volgen uit categorie en suikerrijkdom. Alles is aanpasbaar, met "Herstel voorstel".
- **E7**: waarschuwing bij zout onder 2%, meer dan ca. 25% zoet fruit en zetmeelrijke groente.
- **E8/E10**: smaakhint per specerij en een seizoenslabel per groente.
- **E9**: na oogsten "Bewaar als eigen template" (recept en avatar gaan mee).
- **Avatar**: vorm en kleur van de hoofdgroente, strepen van de tweede groente, stipjes per specerij; een seed
  bepaalt hoedje en blosjes. Opnieuw genereren, naam en kleur aanpassen. Het potje gebruikt verder alle
  bestaande stemmingen, timers en meldingen.

## Keuzes bij de open vragen

- **Gamification**: alleen visueel plus badges en streak; geen punten of levels, om het niet-straffend te houden.
- **PWA vs native**: gebouwd als PWA om het burp-ritme snel te kunnen valideren. Meldingen komen zolang de app
  (of de geïnstalleerde PWA) actief is, en worden vooraf ingepland via Notification Triggers waar de browser dat
  ondersteunt. Voor gegarandeerde meldingen bij een gesloten app is native (of web push met server) nodig;
  `logic.js` is daarvoor herbruikbaar.
- **QR-sticker (later)**: de deeplink `#/jar/<id>?do=burp` logt al een burp, dus een QR-code naar die URL werkt.

> Template-waarden zijn richtwaarden bij ca. 20 °C uit vakkennis en **niet per bron geverifieerd**.
> Laat ze checken voordat de app live gaat.
