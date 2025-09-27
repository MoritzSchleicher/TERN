// src/data/questions.ts
export type Question = {
  id: string
  question: string
  answers: string[]
  correctIndex: number
  location: { lat: number; lng: number; country: string }
  fact: string,
  category: Categories
}

export enum Categories {
  HISTORY = "Geschichte",
  GEO = "Geografie",
  CULTURE = "Kultur",
  FLORA_FAUNA = "Flora & Fauna"
}

export const QuestionPool: Question[] = [
  {
    id: "q1",
    question: "Wo entstand die erste bekannte Demokratie?",
    answers: ["Athen", "Rom", "Sparta"],
    correctIndex: 0,
    location: { lat: 37.9838, lng: 23.7275, country: "Griechenland" },
    fact: "Im 5. Jh. v. Chr. schufen Athens Volksversammlungen frühe demokratische Strukturen.",
    category: Categories.HISTORY
  },
  {
    id: "q2",
    question: "Welcher US-Präsident war am längsten im Amt?",
    answers: ["Franklin D. Roosevelt", "George Washington", "Abraham Lincoln"],
    correctIndex: 0,
    location: { lat: 38.9072, lng: -77.0369, country: "USA" },
    fact: "F. D. Roosevelt amtierte 1933–45; viermal gewählt, länger als jeder andere US-Präsident.",
    category: Categories.HISTORY
  },
  {
    id: "q3",
    question: "Welches Weltwunder befand sich in Ägypten?",
    answers: ["Leuchtturm von Alexandria", "Hängende Gärten", "Koloss von Rhodos"],
    correctIndex: 0,
    location: { lat: 31.2001, lng: 29.9187, country: "Ägypten" },
    fact: "Der Leuchtturm von Alexandria war eines der sieben Weltwunder.",
    category: Categories.HISTORY
  },
  {
    id: "q4",
    question: "Wie heißt die Reform, die Japans Feudalordnung beendete?",
    answers: ["Meiji-Restauration", "Taika-Reform", "Heisei-Reform"],
    correctIndex: 0,
    location: { lat: 35.6762, lng: 139.6503, country: "Japan" },
    fact: "Ab 1868 modernisierte die Meiji-Restauration Verwaltung, Heer und Wirtschaft.",
    category: Categories.HISTORY
  },
  {
    id: "q5",
    question: "Welche Stadt gilt als Wiege der Renaissance?",
    answers: ["Florenz", "Venedig", "Mailand"],
    correctIndex: 0,
    location: { lat: 43.7699, lng: 11.2556, country: "Italien" },
    fact: "In Florenz förderten die Medici Kunst & Wissenschaft; die Renaissance erblühte.",
    category: Categories.CULTURE
  },
  {
    id: "q6",
    question: "In welchem Land entstand das Inkareich?",
    answers: ["Peru", "Bolivien", "Chile"],
    correctIndex: 0,
    location: { lat: -13.5320, lng: -71.9675, country: "Peru" },
    fact: "Cusco war Zentrum des Reichs bis zur span. Eroberung im 16. Jh.",
    category: Categories.HISTORY
  },
  {
    id: "q7",
    question: "Welche Dynastie prägte den Ausbau der Großen Mauer?",
    answers: ["Ming-Dynastie", "Han-Dynastie", "Qing-Dynastie"],
    correctIndex: 0,
    location: { lat: 40.4319, lng: 116.5704, country: "China" },
    fact: "Die Mauer erhielt im 14.–17. Jh. unter der Ming-Dynastie ihre heutige Form.",
    category: Categories.HISTORY
  },
  {
    id: "q8",
    question: "Welche Stadt zerstörte der Vesuv 79 n. Chr.?",
    answers: ["Pompeji", "Herculaneum", "Neapel"],
    correctIndex: 0,
    location: { lat: 40.7460, lng: 14.4989, country: "Italien" },
    fact: "Pompeji wurde von Asche bedeckt und bewahrt Alltagsbilder der Römer.",
    category: Categories.HISTORY
  },
  {
    id: "q9",
    question: "Welcher Fluss durchquert die meisten Staaten?",
    answers: ["Donau", "Nil", "Jangtse"],
    correctIndex: 0,
    location: { lat: 48.2082, lng: 16.3738, country: "Österreich" }, // Wien
    fact: "Die Donau fließt durch 10 Länder und mündet ins Schwarze Meer.",
    category: Categories.GEO
  },
  {
    id: "q10",
    question: "Was ist die größte Insel der Erde?",
    answers: ["Grönland", "Neuguinea", "Borneo"],
    correctIndex: 0,
    location: { lat: 72.0, lng: -40.0, country: "Grönland (Dänemark)" },
    fact: "Grönland ist mit rund 2,16 Mio. km² die größte Insel und zählt nicht als eigener Kontinent.",
    category: Categories.GEO
  },
  {
    id: "q11",
    question: "Welcher See ist der tiefste der Welt?",
    answers: ["Baikalsee", "Tanganjikasee", "Kaspisches Meer"],
    correctIndex: 0,
    location: { lat: 53.5, lng: 108.0, country: "Russland" },
    fact: "Der Baikalsee erreicht über 1600 m Tiefe und enthält ~20% des flüssigen Süßwassers.",
    category: Categories.GEO
  },
  {
    id: "q12",
    question: "Welche Stadt war Hauptstadt des Byzantinischen Reiches?",
    answers: ["Konstantinopel", "Antiochia", "Athen"],
    correctIndex: 0,
    location: { lat: 41.0082, lng: 28.9784, country: "Türkei" },
    fact: "Konstantinopel (heute Istanbul) war ab 330 n. Chr. Zentrum des Oströmischen Reiches.",
    category: Categories.HISTORY
  },
  {
    id: "q13",
    question: "Wo entstand der Tango?",
    answers: ["Argentinien", "Spanien", "Brasilien"],
    correctIndex: 0,
    location: { lat: -34.6037, lng: -58.3816, country: "Argentinien" },
    fact: "Der Tango entwickelte sich um 1900 in Buenos Aires aus afro-europäischen Tanzformen.",
    category: Categories.CULTURE
  },
  {
    id: "q14",
    question: "Welches ist das größte lebende Landraubtier?",
    answers: ["Eisbär", "Sibirischer Tiger", "Grizzlybär"],
    correctIndex: 0,
    location: { lat: 78.0, lng: 16.0, country: "Norwegen (Svalbard)" },
    fact: "Männliche Eisbären erreichen über 600 kg; sie jagen vor allem auf Meereis.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q15",
    question: "Wer begründete das Mongolische Reich?",
    answers: ["Dschingis Khan", "Kublai Khan", "Tamerlan"],
    correctIndex: 0,
    location: { lat: 47.8864, lng: 106.9057, country: "Mongolei" },
    fact: "Dschingis Khan vereinte ab 1206 die Stämme und schuf das größte Landreich der Geschichte.",
    category: Categories.HISTORY
  },
  {
    id: "q16",
    question: "Welcher Berg ist der höchste Afrikas?",
    answers: ["Kilimandscharo", "Mount Kenya", "Rwenzori"],
    correctIndex: 0,
    location: { lat: -3.0674, lng: 37.3556, country: "Tansania" },
    fact: "Der Kilimandscharo (Uhuru Peak) ist 5895 m hoch und ein erloschener Vulkan.",
    category: Categories.GEO
  },
  {
    id: "q17",
    question: "Welches Instrument ist typisch für irische Volksmusik?",
    answers: ["Tin Whistle", "Balalaika", "Duduk"],
    correctIndex: 0,
    location: { lat: 53.3498, lng: -6.2603, country: "Irland" },
    fact: "Die Tin Whistle prägt Jigs & Reels; leichtes Metallflötchen mit sechs Grifflöchern.",
    category: Categories.CULTURE
  },
  {
    id: "q18",
    question: "Welche Revolution begann 1789 in Europa?",
    answers: ["Französische Revolution", "Industrielle Revolution", "Amerikanische Revolution"],
    correctIndex: 0,
    location: { lat: 48.8566, lng: 2.3522, country: "Frankreich" },
    fact: "1789 stürzte die Französische Revolution die Monarchie und prägte Europas Politik.",
    category: Categories.HISTORY
  },
  {
    id: "q19",
    question: "Welcher Ozean ist der größte der Erde?",
    answers: ["Pazifik", "Atlantik", "Indischer Ozean"],
    correctIndex: 0,
    location: { lat: 0.0, lng: -160.0, country: "Pazifischer Ozean" },
    fact: "Der Pazifik bedeckt rund ein Drittel der Erdoberfläche und ist der tiefste Ozean.",
    category: Categories.GEO
  },
  {
    id: "q20",
    question: "Welcher Baum liefert den Naturstoff Kork?",
    answers: ["Korkeiche", "Buche", "Ahorn"],
    correctIndex: 0,
    location: { lat: 38.7223, lng: -9.1393, country: "Portugal" },
    fact: "Kork stammt aus der Rinde der Korkeiche; Portugal ist weltweit führender Produzent.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q21",
    question: "Welche Stadt wurde 1453 vom Osmanischen Reich erobert?",
    answers: ["Konstantinopel", "Wien", "Kairo"],
    correctIndex: 0,
    location: { lat: 41.0082, lng: 28.9784, country: "Türkei" },
    fact: "Mit der Eroberung Konstantinopels endete das Byzantinische Reich.",
    category: Categories.HISTORY
  },
  {
    id: "q22",
    question: "Welcher Kontinent ist der kleinste nach Fläche?",
    answers: ["Australien", "Europa", "Südamerika"],
    correctIndex: 0,
    location: { lat: -25.2744, lng: 133.7751, country: "Australien" },
    fact: "Australien bedeckt nur 6% der Erde, beherbergt aber über 80% weltweit einzigartiger Tierarten.",
    category: Categories.GEO
  },
  {
    id: "q23",
    question: "Welcher italienische Künstler malte die Sixtinische Kapelle?",
    answers: ["Michelangelo", "Leonardo da Vinci", "Raffael"],
    correctIndex: 0,
    location: { lat: 41.9029, lng: 12.4534, country: "Vatikanstadt" },
    fact: "Michelangelo malte 1508–1512 das Deckenfresko der Kapelle im Vatikan.",
    category: Categories.CULTURE
  },
  {
    id: "q24",
    question: "Wie schnell kann ein Gepard bei der Jagd werden?",
    answers: ["über 100 km/h", "etwa 70 km/h", "rund 50 km/h"],
    correctIndex: 0,
    location: { lat: -2.0, lng: 34.0, country: "Tansania" },
    fact: "Geparde erreichen 100 km/h in rund 3 Sekunden – schneller als viele Sportwagen.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q25",
    question: "Auf welcher Inselgruppe setzte Kolumbus 1492 erstmals Fuß in der Neuen Welt?",
    answers: ["Bahamas", "Kuba", "Hispaniola"],
    correctIndex: 0,
    location: { lat: 25.0343, lng: -77.3963, country: "Bahamas" },
    fact: "Kolumbus landete auf den Bahamas, nannte die Insel San Salvador und hielt sie für Asien.",
    category: Categories.HISTORY
  },
  {
    id: "q26",
    question: "Welches Land Südamerikas hat die meisten Nachbarn?",
    answers: ["Brasilien", "Argentinien", "Peru"],
    correctIndex: 0,
    location: { lat: -15.7939, lng: -47.8828, country: "Brasilien" },
    fact: "Brasilien grenzt an 10 Staaten – mehr als jedes andere Land in Südamerika.",
    category: Categories.GEO
  },
  {
    id: "q27",
    question: "Welches antike Bauwerk steht in Rom?",
    answers: ["Kolosseum", "Parthenon", "Pantheon"],
    correctIndex: 0,
    location: { lat: 41.8902, lng: 12.4922, country: "Italien" },
    fact: "Das Kolosseum war Amphitheater für Gladiatorenkämpfe und Shows.",
    category: Categories.HISTORY
  },
  {
    id: "q28",
    question: "Wo wird traditionell Flamenco getanzt?",
    answers: ["Spanien", "Portugal", "Italien"],
    correctIndex: 0,
    location: { lat: 37.3891, lng: -5.9845, country: "Spanien" },
    fact: "Der Flamenco entstand in Andalusien aus Roma- und andalusischen Traditionen.",
    category: Categories.CULTURE
  },
  {
    id: "q29",
    question: "Welcher Vogel kann Wörter nachahmen?",
    answers: ["Papagei", "Krähe", "Kuckuck"],
    correctIndex: 0,
    location: { lat: -15.0, lng: -47.0, country: "Brasilien" },
    fact: "Papageien können menschliche Laute imitieren und sind sehr lernfähig.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q30",
    question: "Wann fiel die Berliner Mauer?",
    answers: ["1989", "1979", "1991"],
    correctIndex: 0,
    location: { lat: 52.5200, lng: 13.4050, country: "Deutschland" },
    fact: "Am 9. November 1989 fiel die Mauer, Symbol des Kalten Kriegs.",
    category: Categories.HISTORY
  },
  {
    id: "q31",
    question: "Welcher Fluss ist der längste Afrikas?",
    answers: ["Nil", "Kongo", "Niger"],
    correctIndex: 0,
    location: { lat: 30.0444, lng: 31.2357, country: "Ägypten" },
    fact: "Der Nil ist etwa 6650 km lang und versorgt Millionen Menschen mit Wasser.",
    category: Categories.GEO
  },
  {
    id: "q32",
    question: "Welcher deutsche Komponist schrieb die 9. Sinfonie?",
    answers: ["Beethoven", "Bach", "Mozart"],
    correctIndex: 0,
    location: { lat: 50.7374, lng: 7.0982, country: "Deutschland" },
    fact: "Beethovens 9. enthält die berühmte ‚Ode an die Freude‘.",
    category: Categories.CULTURE
  },
  {
    id: "q33",
    question: "Welches Tier legt die größten Eier?",
    answers: ["Strauß", "Pinguin", "Adler"],
    correctIndex: 0,
    location: { lat: -29.0, lng: 24.0, country: "Südafrika" },
    fact: "Straußeneier wiegen bis 1,5 kg, die größten im Tierreich.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q34",
    question: "Wer erfand den Buchdruck mit beweglichen Lettern?",
    answers: ["Johannes Gutenberg", "Leonardo da Vinci", "Albrecht Dürer"],
    correctIndex: 0,
    location: { lat: 49.9929, lng: 8.2473, country: "Deutschland" },
    fact: "Gutenbergs Erfindung revolutionierte ab 1450 die Verbreitung von Wissen.",
    category: Categories.HISTORY
  },
  {
    id: "q35",
    question: "Welches Land ist für die Pyramiden von Gizeh bekannt?",
    answers: ["Ägypten", "Mexiko", "Sudan"],
    correctIndex: 0,
    location: { lat: 29.9792, lng: 31.1342, country: "Ägypten" },
    fact: "Die Cheops-Pyramide ist das älteste der sieben Weltwunder.",
    category: Categories.HISTORY
  },
  {
    id: "q36",
    question: "Welche Stadt nennt man ‚Big Apple‘?",
    answers: ["New York", "Los Angeles", "Chicago"],
    correctIndex: 0,
    location: { lat: 40.7128, lng: -74.0060, country: "USA" },
    fact: "New York trägt den Spitznamen ‚Big Apple‘ seit den 1920er Jahren.",
    category: Categories.CULTURE
  },
  {
    id: "q37",
    question: "Welcher Kontinent hat die meisten Länder?",
    answers: ["Afrika", "Europa", "Asien"],
    correctIndex: 0,
    location: { lat: 0.0, lng: 20.0, country: "Afrika" },
    fact: "Afrika besteht aus 54 souveränen Staaten.",
    category: Categories.GEO
  },
  {
    id: "q38",
    question: "Welcher deutsche Dichter schrieb ‚Faust‘?",
    answers: ["Goethe", "Schiller", "Lessing"],
    correctIndex: 0,
    location: { lat: 50.9795, lng: 11.3235, country: "Deutschland" },
    fact: "Goethes Tragödie ‚Faust‘ gilt als Höhepunkt deutscher Literatur.",
    category: Categories.CULTURE
  },
  {
    id: "q39",
    question: "Welches Säugetier kann fliegen?",
    answers: ["Fledermaus", "Kolibri", "Flughörnchen"],
    correctIndex: 0,
    location: { lat: 48.0, lng: 11.0, country: "Deutschland" },
    fact: "Fledermäuse sind die einzigen aktiv flugfähigen Säugetiere.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q40",
    question: "Wann begann der Erste Weltkrieg?",
    answers: ["1914", "1918", "1939"],
    correctIndex: 0,
    location: { lat: 48.2082, lng: 16.3738, country: "Österreich" },
    fact: "Der Krieg begann 1914 nach dem Attentat von Sarajevo.",
    category: Categories.HISTORY
  },
  {
    id: "q41",
    question: "Welcher Fluss fließt durch Paris?",
    answers: ["Seine", "Loire", "Rhone"],
    correctIndex: 0,
    location: { lat: 48.8566, lng: 2.3522, country: "Frankreich" },
    fact: "Die Seine prägt das Stadtbild von Paris.",
    category: Categories.GEO
  },
  {
    id: "q42",
    question: "Welcher Maler schuf die ‚Mona Lisa‘?",
    answers: ["Leonardo da Vinci", "Michelangelo", "Rembrandt"],
    correctIndex: 0,
    location: { lat: 43.7699, lng: 11.2556, country: "Italien" },
    fact: "Leonardo malte die Mona Lisa um 1503; heute im Louvre ausgestellt.",
    category: Categories.CULTURE
  },
  {
    id: "q43",
    question: "Welches Tier ist das größte der Welt?",
    answers: ["Blauwal", "Elefant", "Walhai"],
    correctIndex: 0,
    location: { lat: -54.8, lng: -68.3, country: "Chile" },
    fact: "Blauwale erreichen über 30 m Länge und 180 Tonnen Gewicht.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q44",
    question: "Wann endete der Zweite Weltkrieg in Europa?",
    answers: ["1945", "1944", "1946"],
    correctIndex: 0,
    location: { lat: 52.52, lng: 13.405, country: "Deutschland" },
    fact: "Am 8. Mai 1945 kapitulierte Deutschland, Kriegsende in Europa.",
    category: Categories.HISTORY
  },
  {
    id: "q45",
    question: "Welcher See liegt zwischen Israel und Jordanien?",
    answers: ["Totes Meer", "Galiläisches Meer", "Saltonsee"],
    correctIndex: 0,
    location: { lat: 31.5590, lng: 35.4732, country: "Israel/Jordanien" },
    fact: "Das Tote Meer liegt 430m unter dem Meeresspiegel, sehr salzhaltig.",
    category: Categories.GEO
  },
  {
    id: "q46",
    question: "Wer komponierte ‚Die Zauberflöte‘?",
    answers: ["Mozart", "Haydn", "Beethoven"],
    correctIndex: 0,
    location: { lat: 48.2082, lng: 16.3738, country: "Österreich" },
    fact: "Mozarts Oper ‚Die Zauberflöte‘ wurde 1791 uraufgeführt.",
    category: Categories.CULTURE
  },
  {
    id: "q47",
    question: "Welches Tier ist das Wahrzeichen Australiens?",
    answers: ["Känguru", "Koala", "Emu"],
    correctIndex: 0,
    location: { lat: -25.0, lng: 133.0, country: "Australien" },
    fact: "Das Känguru ziert auch das Wappen Australiens.",
    category: Categories.FLORA_FAUNA
  },
  {
    id: "q48",
    question: "Welches Jahr markiert den Beginn der Reformation?",
    answers: ["1517", "1618", "1648"],
    correctIndex: 0,
    location: { lat: 51.8663, lng: 12.6270, country: "Deutschland" },
    fact: "1517 schlug Martin Luther seine 95 Thesen in Wittenberg an.",
    category: Categories.HISTORY
  },
  {
    id: "q49",
    question: "Welcher Gebirgszug trennt Europa von Asien?",
    answers: ["Ural", "Alpen", "Kaukasus"],
    correctIndex: 0,
    location: { lat: 60.0, lng: 60.0, country: "Russland" },
    fact: "Der Ural gilt als geographische Grenze zwischen Europa und Asien.",
    category: Categories.GEO
  },
  {
    id: "q50",
    question: "Welches Instrument spielte Ludwig van Beethoven?",
    answers: ["Klavier", "Violine", "Cello"],
    correctIndex: 0,
    location: { lat: 50.7374, lng: 7.0982, country: "Deutschland" },
    fact: "Beethoven war Pianist und Komponist, berühmt für seine Klaviersonaten.",
    category: Categories.CULTURE
  }
  
]
