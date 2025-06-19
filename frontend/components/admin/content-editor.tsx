"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Save, RotateCcw, Loader2 } from "lucide-react";
import type {
  HomePageContent,
  HowItWorksStep,
  RentalRule,
} from "@/types/content";
import { toast } from "sonner";

export function ContentEditor() {
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch("/api/content");
      if (response.ok) {
        const data = await response.json();
        setContent(data.content);
      } else {
        throw new Error("Failed to load content");
      }
    } catch (error) {
      console.error("Error loading content:", error);
      toast("Error loading content");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!content) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        toast("Content saved successfully!");
      } else {
        throw new Error("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      toast("Error loading content");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch("/api/content/reset", {
        method: "POST",
      });

      if (response.ok) {
        await loadContent(); // Reload content from database
        toast("Content reset to default");
      } else {
        throw new Error("Failed to reset content");
      }
    } catch (error) {
      console.error("Error resetting content:", error);
      toast("Error loading content");
    } finally {
      setIsResetting(false);
    }
  };

  const updateHero = (field: keyof typeof content.hero, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    });
  };

  const updateHowItWorks = (
    field: keyof typeof content.howItWorks,
    value: any
  ) => {
    if (!content) return;
    setContent({
      ...content,
      howItWorks: { ...content.howItWorks, [field]: value },
    });
  };

  const updateStep = (
    stepId: string,
    field: keyof HowItWorksStep,
    value: string
  ) => {
    if (!content) return;
    const updatedSteps = content.howItWorks.steps.map((step) =>
      step.id === stepId ? { ...step, [field]: value } : step
    );
    updateHowItWorks("steps", updatedSteps);
  };

  const updateRentalGuidelines = (
    field: keyof typeof content.rentalGuidelines,
    value: any
  ) => {
    if (!content) return;
    setContent({
      ...content,
      rentalGuidelines: { ...content.rentalGuidelines, [field]: value },
    });
  };

  const updateRule = (ruleId: string, field: keyof RentalRule, value: any) => {
    if (!content) return;
    const updatedRules = content.rentalGuidelines.rules.map((rule) =>
      rule.id === ruleId ? { ...rule, [field]: value } : rule
    );
    updateRentalGuidelines("rules", updatedRules);
  };

  const addRuleItem = (ruleId: string) => {
    if (!content) return;
    const updatedRules = content.rentalGuidelines.rules.map((rule) =>
      rule.id === ruleId ? { ...rule, items: [...rule.items, ""] } : rule
    );
    updateRentalGuidelines("rules", updatedRules);
  };

  const removeRuleItem = (ruleId: string, itemIndex: number) => {
    if (!content) return;
    const updatedRules = content.rentalGuidelines.rules.map((rule) =>
      rule.id === ruleId
        ? {
            ...rule,
            items: rule.items.filter((_, index) => index !== itemIndex),
          }
        : rule
    );
    updateRentalGuidelines("rules", updatedRules);
  };

  const updateRuleItem = (ruleId: string, itemIndex: number, value: string) => {
    if (!content) return;
    const updatedRules = content.rentalGuidelines.rules.map((rule) =>
      rule.id === ruleId
        ? {
            ...rule,
            items: rule.items.map((item, index) =>
              index === itemIndex ? value : item
            ),
          }
        : rule
    );
    updateRentalGuidelines("rules", updatedRules);
  };

  const updateCTA = (field: keyof typeof content.cta, value: string) => {
    if (!content) return;
    setContent({
      ...content,
      cta: { ...content.cta, [field]: value },
    });
  };

  if (isLoading || !content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading content...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Home Page Content Editor</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleReset}
            variant="outline"
            disabled={isResetting}
          >
            {isResetting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 mr-2" />
            )}
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
          <TabsTrigger value="rental-guidelines">Rental Guidelines</TabsTrigger>
          <TabsTrigger value="cta">CTA Section</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-badge">Badge Text</Label>
                <Input
                  id="hero-badge"
                  value={content.hero.badge}
                  onChange={(e) => updateHero("badge", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={content.hero.title}
                  onChange={(e) => updateHero("title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hero-highlight">Highlight Word</Label>
                <Input
                  id="hero-highlight"
                  value={content.hero.highlightWord}
                  onChange={(e) => updateHero("highlightWord", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={content.hero.description}
                  onChange={(e) => updateHero("description", e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="hero-button-text">Button Text</Label>
                <Input
                  id="hero-button-text"
                  value={content.hero.buttonText}
                  onChange={(e) => updateHero("buttonText", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hero-button-link">Button Link</Label>
                <Input
                  id="hero-button-link"
                  value={content.hero.buttonLink}
                  onChange={(e) => updateHero("buttonLink", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="how-it-works">
          <Card>
            <CardHeader>
              <CardTitle>How It Works Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="hiw-title">Section Title</Label>
                <Input
                  id="hiw-title"
                  value={content.howItWorks.title}
                  onChange={(e) => updateHowItWorks("title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hiw-subtitle">Section Subtitle</Label>
                <Textarea
                  id="hiw-subtitle"
                  value={content.howItWorks.subtitle}
                  onChange={(e) => updateHowItWorks("subtitle", e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Steps</h3>
                {content.howItWorks.steps.map((step, index) => (
                  <Card key={step.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Step {index + 1}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Icon (Lucide icon name)</Label>
                        <Input
                          value={step.icon}
                          onChange={(e) =>
                            updateStep(step.id, "icon", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={step.title}
                          onChange={(e) =>
                            updateStep(step.id, "title", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={step.description}
                          onChange={(e) =>
                            updateStep(step.id, "description", e.target.value)
                          }
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rental-guidelines">
          <Card>
            <CardHeader>
              <CardTitle>Rental Guidelines Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="rg-title">Section Title</Label>
                <Input
                  id="rg-title"
                  value={content.rentalGuidelines.title}
                  onChange={(e) =>
                    updateRentalGuidelines("title", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="rg-subtitle">Section Subtitle</Label>
                <Textarea
                  id="rg-subtitle"
                  value={content.rentalGuidelines.subtitle}
                  onChange={(e) =>
                    updateRentalGuidelines("subtitle", e.target.value)
                  }
                  rows={2}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Rules</h3>
                {content.rentalGuidelines.rules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{rule.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label>Icon (Lucide icon name)</Label>
                        <Input
                          value={rule.icon}
                          onChange={(e) =>
                            updateRule(rule.id, "icon", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={rule.title}
                          onChange={(e) =>
                            updateRule(rule.id, "title", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label>Items</Label>
                          <Button
                            size="sm"
                            onClick={() => addRuleItem(rule.id)}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Item
                          </Button>
                        </div>
                        {rule.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex gap-2 mb-2">
                            <Input
                              value={item}
                              onChange={(e) =>
                                updateRuleItem(
                                  rule.id,
                                  itemIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Rule item"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeRuleItem(rule.id, itemIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cta">
          <Card>
            <CardHeader>
              <CardTitle>CTA Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cta-title">Title</Label>
                <Input
                  id="cta-title"
                  value={content.cta.title}
                  onChange={(e) => updateCTA("title", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cta-email-label">Email Label</Label>
                <Input
                  id="cta-email-label"
                  value={content.cta.emailLabel}
                  onChange={(e) => updateCTA("emailLabel", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cta-email">Email Address</Label>
                <Input
                  id="cta-email"
                  type="email"
                  value={content.cta.email}
                  onChange={(e) => updateCTA("email", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
