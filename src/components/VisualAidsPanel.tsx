import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  PieChart, 
  Image, 
  FileText, 
  Play, 
  Download,
  Maximize2,
  Brain,
  BookOpen
} from 'lucide-react';

interface VisualAid {
  id: string;
  type: 'chart' | 'diagram' | 'image' | 'document' | 'interactive';
  title: string;
  description: string;
  thumbnail: string;
  content: string;
  subject: string;
}

interface VisualAidsPanelProps {
  currentTopic?: string;
}

export const VisualAidsPanel: React.FC<VisualAidsPanelProps> = ({ currentTopic = "Mathematics" }) => {
  const [selectedAid, setSelectedAid] = useState<VisualAid | null>(null);
  const [activeTab, setActiveTab] = useState("recommended");

  // Mock data for visual aids
  const visualAids: VisualAid[] = [
    {
      id: '1',
      type: 'chart',
      title: 'Quadratic Function Graph',
      description: 'Interactive graph showing y = ax² + bx + c',
      thumbnail: '/placeholder.svg',
      content: 'Interactive quadratic function visualization',
      subject: 'Mathematics'
    },
    {
      id: '2',
      type: 'diagram',
      title: 'Photosynthesis Process',
      description: 'Step-by-step diagram of plant photosynthesis',
      thumbnail: '/placeholder.svg',
      content: 'Photosynthesis process diagram',
      subject: 'Biology'
    },
    {
      id: '3',
      type: 'interactive',
      title: 'Periodic Table Explorer',
      description: 'Interactive periodic table with element details',
      thumbnail: '/placeholder.svg',
      content: 'Interactive periodic table',
      subject: 'Chemistry'
    },
    {
      id: '4',
      type: 'image',
      title: 'Solar System Scale',
      description: 'Comparative sizes of planets and distances',
      thumbnail: '/placeholder.svg',
      content: 'Solar system scale visualization',
      subject: 'Physics'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chart': return <BarChart3 className="w-4 h-4" />;
      case 'diagram': return <FileText className="w-4 h-4" />;
      case 'image': return <Image className="w-4 h-4" />;
      case 'interactive': return <Play className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'chart': return 'bg-primary/10 text-primary';
      case 'diagram': return 'bg-secondary/10 text-secondary';
      case 'image': return 'bg-accent/10 text-accent';
      case 'interactive': return 'bg-gradient-primary text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-subtle">
      <div className="p-4 border-b border-border bg-card shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Visual Learning Aids</h3>
          </div>
          <div className="text-sm text-muted-foreground">
            Topic: <span className="font-medium text-foreground">{currentTopic}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="generated">AI Generated</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recommended" className="flex-1 space-y-3 mt-0">
            <div className="grid gap-3">
              {visualAids.slice(0, 2).map((aid) => (
                <Card key={aid.id} className="p-3 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedAid(aid)}>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <img src={aid.thumbnail} alt={aid.title} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(aid.type)}`}>
                          {getTypeIcon(aid.type)}
                          {aid.type}
                        </span>
                      </div>
                      <h4 className="font-medium text-foreground text-sm leading-snug">{aid.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{aid.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="library" className="flex-1 space-y-3 mt-0">
            <div className="grid gap-3">
              {visualAids.map((aid) => (
                <Card key={aid.id} className="p-3 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedAid(aid)}>
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <img src={aid.thumbnail} alt={aid.title} className="w-full h-full object-cover rounded-lg" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(aid.type)}`}>
                          {getTypeIcon(aid.type)}
                          {aid.type}
                        </span>
                        <span className="text-xs text-muted-foreground">{aid.subject}</span>
                      </div>
                      <h4 className="font-medium text-foreground text-sm leading-snug">{aid.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{aid.description}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="flex-shrink-0">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="generated" className="flex-1 mt-0">
            <Card className="p-6 text-center shadow-soft">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">AI-Generated Visual Aids</h4>
              <p className="text-sm text-muted-foreground mb-4">
                The AI can generate custom visual aids based on your current lesson and student questions.
              </p>
              <Button className="bg-gradient-primary hover:shadow-ai transition-all duration-300">
                <BookOpen className="w-4 h-4 mr-2" />
                Generate Visual Aid
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal for selected visual aid */}
      {selectedAid && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
             onClick={() => setSelectedAid(null)}>
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{selectedAid.title}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAid(null)}>
                  ✕
                </Button>
              </div>
            </div>
            <div className="p-4">
              <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                <span className="text-muted-foreground">{selectedAid.content}</span>
              </div>
              <p className="text-sm text-muted-foreground">{selectedAid.description}</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};