import { useState } from "react";
import { useApp } from "@/lib/AppStateContext";
import { Companion, SPECIES } from "@/components/Companion";
import { CompanionSpeciesId } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check, Sparkles, Sun, Moon, ListChecks, Heart, Trophy, Hand } from "lucide-react";

type Step = 0 | 1 | 2 | 3 | 4;

export function Onboarding() {
  const { state, setCompanionSpecies, setCompanionName, finishOnboarding } = useApp();
  const [step, setStep] = useState<Step>(0);
  const [species, setSpecies] = useState<CompanionSpeciesId>(state.companionSpecies);
  const [name, setName] = useState<string>("");

  const speciesInfo = SPECIES.find(s => s.id === species)!;

  const next = () => setStep(s => (s < 4 ? ((s + 1) as Step) : s));
  const back = () => setStep(s => (s > 0 ? ((s - 1) as Step) : s));

  const handleSelectSpecies = (id: CompanionSpeciesId) => {
    setSpecies(id);
    const info = SPECIES.find(s => s.id === id)!;
    if (!name) setName(info.defaultName);
  };

  const finish = () => {
    setCompanionSpecies(species);
    setCompanionName((name || speciesInfo.defaultName).trim());
    finishOnboarding();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-soft/40 via-background to-calm-soft/40">
      <div className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-5 py-8">
        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          {step === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 pop-in">
              <Companion mood={4} size={160} species="sun" celebrate />
              <div className="space-y-3">
                <h1 className="text-3xl font-display font-semibold">Hej och välkommen! 👋</h1>
                <p className="text-muted-foreground max-w-sm">
                  Det här är en lugn liten app som hjälper dig komma igång på morgonen,
                  hålla koll på hur du mår och samla poäng tillsammans med din egen följeslagare.
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex-1 space-y-4 pop-in">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Så här funkar det · 1 av 2</p>
                <h1 className="text-2xl font-display font-semibold">Rutiner och schema</h1>
              </div>
              <div className="space-y-3">
                <FeatureCard
                  icon={<Sun className="w-5 h-5" />}
                  title="Morgonrutin"
                  body="Bocka av saker som väcka, frukost och kläder. +5 poäng per grej och +15 när allt är klart."
                />
                <FeatureCard
                  icon={<Moon className="w-5 h-5" />}
                  title="Kvällsrutin"
                  body="En lugn checklista för kvällen – lägg fram kläder, packa väskan, varva ner. Gör morgonen mycket lättare."
                />
                <FeatureCard
                  icon={<ListChecks className="w-5 h-5" />}
                  title="Schema med aktiviteter"
                  body="Lägg in lektioner OCH fritidsaktiviteter som fotboll, dans eller musik. Bedöm hur det kändes – röd, gul eller grön."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 space-y-4 pop-in">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Så här funkar det · 2 av 2</p>
                <h1 className="text-2xl font-display font-semibold">Mående & följeslagare</h1>
              </div>
              <div className="space-y-3">
                <FeatureCard
                  icon={<Heart className="w-5 h-5" />}
                  title="Hur mår du?"
                  body="Checka in med ett känsloansikte. Du får tips som passar precis hur du känner dig."
                />
                <FeatureCard
                  icon={<Hand className="w-5 h-5" />}
                  title="Klappa följeslagaren"
                  body="Tryck och dra över din följeslagare för att klappa den. Den vickar, det regnar hjärtan och den blir gladare."
                />
                <FeatureCard
                  icon={<Trophy className="w-5 h-5" />}
                  title="Poäng, streaks & achievements"
                  body="Samla poäng och håll igång din streak. Lås upp över 20 achievements på vägen!"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 space-y-5 pop-in">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Steg 1 av 2</p>
                <h1 className="text-2xl font-display font-semibold">Välj din följeslagare 🌟</h1>
                <p className="text-sm text-muted-foreground">
                  Den växer och blir gladare när du sköter dina rutiner.
                </p>
              </div>

              <Card className="border-0 gradient-warm p-5 flex flex-col items-center shadow-card-soft">
                <Companion mood={4} size={140} species={species} />
                <p className="font-display text-lg mt-2">{speciesInfo.name}</p>
                <p className="text-sm text-muted-foreground text-center">{speciesInfo.description}</p>
              </Card>

              <div className="grid grid-cols-3 gap-2">
                {SPECIES.map(s => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectSpecies(s.id)}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                      species === s.id
                        ? "bg-primary-soft ring-2 ring-primary shadow-soft"
                        : "bg-card shadow-card-soft hover:shadow-soft"
                    }`}
                    aria-label={s.name}
                  >
                    <span className="text-3xl">{s.emoji}</span>
                    <span className="text-xs font-medium">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 space-y-5 pop-in">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Steg 2 av 2</p>
                <h1 className="text-2xl font-display font-semibold">Vad ska den heta? ✨</h1>
                <p className="text-sm text-muted-foreground">
                  Du kan ändra namnet senare på Min sida.
                </p>
              </div>

              <Card className="border-0 gradient-calm p-5 flex flex-col items-center shadow-card-soft">
                <Companion mood={4} size={140} species={species} celebrate />
                <p className="font-display text-xl mt-2">
                  {(name || speciesInfo.defaultName).trim() || speciesInfo.defaultName}
                </p>
              </Card>

              <div className="space-y-2">
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={speciesInfo.defaultName}
                  className="rounded-2xl h-12 text-base"
                  maxLength={20}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground px-1">
                  Lämna tomt för att använda förslaget.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-2 pt-6">
          {step > 0 && (
            <Button variant="ghost" onClick={back} className="rounded-2xl">
              <ArrowLeft className="w-4 h-4 mr-1" /> Tillbaka
            </Button>
          )}
          <div className="flex-1" />
          {step < 4 && (
            <Button onClick={next} size="lg" className="rounded-2xl">
              {step === 0 ? "Kom igång" : "Vidare"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
          {step === 4 && (
            <Button onClick={finish} size="lg" className="rounded-2xl">
              <Sparkles className="w-4 h-4 mr-1" /> Sätt igång
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card className="p-4 border-0 shadow-card-soft flex gap-3 items-start">
      <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{body}</p>
      </div>
    </Card>
  );
}
