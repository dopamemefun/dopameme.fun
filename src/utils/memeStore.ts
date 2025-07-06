// Centralized meme store for sharing data between admin and public views
interface MemeEntry {
  id: string;
  title: string;
  originalFilename: string;
  uploadDate: string;
  fileSize: string;
  duration: string;
  tags: string[];
  viewCount: number;
  downloadCount: number;
  trendingScore: number;
  status: 'processing' | 'processed' | 'error';
  thumbnail: string;
  videoUrl: string;
  format: 'mp4' | 'webm' | 'gif';
  category: 'trending' | 'recent' | 'most-downloaded';
  aspectRatio: number;
}

class MemeStore {
  private memes: MemeEntry[] = [];
  private listeners: Array<(memes: MemeEntry[]) => void> = [];

  addMeme(meme: MemeEntry) {
    this.memes = [meme, ...this.memes];
    this.notifyListeners();
  }

  updateMeme(id: string, updates: Partial<MemeEntry>) {
    this.memes = this.memes.map(meme => 
      meme.id === id ? { ...meme, ...updates } : meme
    );
    this.notifyListeners();
  }

  deleteMeme(id: string) {
    this.memes = this.memes.filter(meme => meme.id !== id);
    this.notifyListeners();
  }

  deleteMemes(ids: string[]) {
    this.memes = this.memes.filter(meme => !ids.includes(meme.id));
    this.notifyListeners();
  }

  getAllMemes(): MemeEntry[] {
    return [...this.memes];
  }

  getProcessedMemes(): MemeEntry[] {
    return this.memes.filter(meme => meme.status === 'processed');
  }

  getTrendingMemes(): MemeEntry[] {
    return this.getProcessedMemes()
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, 20);
  }

  getMemesByCategory(category: 'trending' | 'recent' | 'most-downloaded'): MemeEntry[] {
    const processed = this.getProcessedMemes();
    
    switch (category) {
      case 'trending':
        return processed
          .sort((a, b) => b.trendingScore - a.trendingScore)
          .slice(0, 50);
      case 'recent':
        return processed
          .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
          .slice(0, 50);
      case 'most-downloaded':
        return processed
          .sort((a, b) => b.downloadCount - a.downloadCount)
          .slice(0, 50);
      default:
        return processed;
    }
  }

  incrementDownloadCount(id: string) {
    this.updateMeme(id, { 
      downloadCount: (this.memes.find(m => m.id === id)?.downloadCount || 0) + 1 
    });
  }

  incrementViewCount(id: string) {
    this.updateMeme(id, { 
      viewCount: (this.memes.find(m => m.id === id)?.viewCount || 0) + 1 
    });
  }

  subscribe(listener: (memes: MemeEntry[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.memes));
  }

  // Initialize with some sample data for demo purposes
  initializeSampleData() {
    if (this.memes.length === 0) {
      const sampleMemes: MemeEntry[] = [
        {
          id: 'sample-1',
          title: 'Cat Vibing to Beat',
          originalFilename: 'cat_vibing_beat.mp4',
          uploadDate: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          fileSize: '3.2MB',
          duration: '0:15',
          tags: ['cat', 'vibing', 'music'],
          viewCount: 2300,
          downloadCount: 450,
          trendingScore: 95,
          status: 'processed',
          thumbnail: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
          videoUrl: 'https://example.com/cat-vibing.mp4',
          format: 'mp4',
          category: 'trending',
          aspectRatio: 0.75
        },
        {
          id: 'sample-2',
          title: 'Epic Fail Compilation',
          originalFilename: 'epic_fail_compilation.mp4',
          uploadDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          fileSize: '5.8MB',
          duration: '0:23',
          tags: ['fail', 'compilation', 'funny'],
          viewCount: 1800,
          downloadCount: 320,
          trendingScore: 88,
          status: 'processed',
          thumbnail: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400&h=400',
          videoUrl: 'https://example.com/epic-fail.mp4',
          format: 'mp4',
          category: 'most-downloaded',
          aspectRatio: 1
        },
        {
          id: 'sample-3',
          title: 'Dancing Dog Meme',
          originalFilename: 'dancing_dog_meme.mp4',
          uploadDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          fileSize: '4.1MB',
          duration: '0:18',
          tags: ['dog', 'dancing', 'cute'],
          viewCount: 3100,
          downloadCount: 580,
          trendingScore: 92,
          status: 'processed',
          thumbnail: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400&h=300',
          videoUrl: 'https://example.com/dancing-dog.mp4',
          format: 'mp4',
          category: 'trending',
          aspectRatio: 1.33
        }
      ];

      sampleMemes.forEach(meme => this.addMeme(meme));
    }
  }
}

export const memeStore = new MemeStore();
export type { MemeEntry };