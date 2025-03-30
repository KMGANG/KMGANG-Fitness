
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const initialPlan = {
  "Push (Tag 1)": [
    "Brustpresse",
    "Schrägbankmaschine / Kurzhanteln",
    "Schulterpresse",
    "Seitheben",
    "Trizepsdrücken am Kabel",
    "Überkopf-Trizeps"
  ],
  "Beine (Tag 2)": [
    "Beinpresse",
    "Kniebeugen an der Multipresse",
    "Beinbeuger",
    "Beinstrecker",
    "Wadenheben (stehend)",
    "Glute Kickbacks"
  ],
  "Pull (Tag 3)": [
    "Latzug",
    "Rudern am Kabel",
    "Rudermaschine",
    "Face Pulls",
    "Bizepscurls",
    "Konzentrationscurls"
  ],
  "Stabilität & Core (Tag 4)": [
    "Ausfallschritte",
    "Sumo-Kniebeugen",
    "Beinbeuger (Variante)",
    "Wadenheben (Variante)",
    "Planks",
    "Russian Twists"
  ]
};

const homeWorkouts = {
  "Workout A": [
    "Kniebeugen x 15",
    "Wandsitz 30 Sek.",
    "Glute Bridge x 20",
    "Ausfallschritte x 10/Bein",
    "Plank 30 Sek."
  ],
  "Workout B": [
    "Jumping Jacks 1 Min.",
    "Bergsteiger 30 Sek.",
    "Air Squats x 20",
    "Superman Hold 30 Sek.",
    "Seitstütz 20 Sek./Seite"
  ],
  "Workout C": [
    "Step-ups auf Stuhl x 10/Bein",
    "Glute Bridge x 15",
    "Kniebeugen mit Tempo (5 Sek. runter) x 10",
    "Seitliche Ausfallschritte x 10",
    "Crunches x 20"
  ]
};

export default function FitnessTracker() {
  const [log, setLog] = useState({});
  const [weight, setWeight] = useState("");
  const [savedWeight, setSavedWeight] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("fitness-log");
    if (saved) setLog(JSON.parse(saved));

    const savedW = localStorage.getItem("weight-log");
    if (savedW) setSavedWeight(JSON.parse(savedW));
  }, []);

  useEffect(() => {
    localStorage.setItem("fitness-log", JSON.stringify(log));
    localStorage.setItem("weight-log", JSON.stringify(savedWeight));
  }, [log, savedWeight]);

  const handleInputChange = (day, exercise, value) => {
    setLog(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [exercise]: value
      }
    }));
  };

  const saveWeight = () => {
    const entry = { date: new Date().toLocaleDateString(), weight };
    setSavedWeight(prev => [...prev, entry]);
    setWeight("");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Karens Fitness App</h1>

      <Tabs defaultValue="Training">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3">
          <TabsTrigger value="Training">📋 Trainingsplan</TabsTrigger>
          <TabsTrigger value="Gewicht">⚖️ Gewicht</TabsTrigger>
          <TabsTrigger value="HomeWorkouts">🏠 Home Workouts</TabsTrigger>
        </TabsList>

        <TabsContent value="Training">
          <Tabs defaultValue="Push (Tag 1)">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4">
              {Object.keys(initialPlan).map(day => (
                <TabsTrigger key={day} value={day}>{day}</TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(initialPlan).map(([day, exercises]) => (
              <TabsContent key={day} value={day}>
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="text-lg font-medium">{day}</h3>
                    {exercises.map(ex => (
                      <div key={ex} className="flex flex-col">
                        <label className="text-sm font-medium">{ex}</label>
                        <Input
                          placeholder="z. B. 3x10 mit 40kg"
                          value={log[day]?.[ex] || ""}
                          onChange={e => handleInputChange(day, ex, e.target.value)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="Gewicht">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-2">Gewicht erfassen</h2>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="z. B. 75.3"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                />
                <Button onClick={saveWeight}>Speichern</Button>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Letzte Einträge:
                <ul>
                  {savedWeight.slice(-5).reverse().map((entry, idx) => (
                    <li key={idx}>{entry.date}: {entry.weight} kg</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="HomeWorkouts">
          <Card>
            <CardContent className="p-4 space-y-4">
              <h2 className="text-xl font-semibold">🏠 Home Workouts (≤15 Min)</h2>
              {Object.entries(homeWorkouts).map(([title, exercises]) => (
                <div key={title} className="border-b pb-4">
                  <h3 className="text-lg font-bold mb-2">{title}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {exercises.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
