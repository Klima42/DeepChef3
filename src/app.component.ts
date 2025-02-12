import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  isError?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="border rounded-xl bg-white shadow-lg mt-6">
      <div class="flex items-center justify-between p-4 border-b">
        <div class="flex items-center gap-2">
          <span class="text-blue-600 text-xl">🍽️</span>
          <h3 class="font-semibold">ChefGPT</h3>
        </div>
        <button (click)="isOpen = !isOpen" class="p-1 hover:bg-gray-100 rounded-lg">
          <span class="w-5 h-5 text-gray-500">✕</span>
        </button>
      </div>

      <div class="flex border-b">
        <button 
          (click)="activeWindow = 'chat'"
          [class]="'flex-1 px-4 py-2 ' + (activeWindow === 'chat' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700')">
          ChefGPT Chat
        </button>
        <button 
          (click)="activeWindow = 'image'"
          [class]="'flex-1 px-4 py-2 ' + (activeWindow === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700')">
          Moondream Analysis
        </button>
      </div>

      <div *ngIf="isOpen" class="h-96 flex flex-col">
        <!-- Chat Window -->
        <div *ngIf="activeWindow === 'chat'" class="flex-1 flex flex-col">
          <div class="flex-1 overflow-y-auto p-4 space-y-4">
            <div *ngFor="let message of messages" 
                [class]="'flex gap-3 ' + (message.type === 'user' ? 'justify-end' : 'justify-start')">
              <div [class]="'max-w-md p-4 rounded-xl ' + 
                (message.type === 'user' ? 'bg-blue-100 ml-12' : 'bg-gray-100 mr-12') + 
                (message.isError ? ' bg-red-50 border border-red-100' : '')">
                <div class="flex items-center gap-2 mb-2">
                  <span *ngIf="message.type === 'ai'" class="text-blue-600 text-lg">🍽️</span>
                  <span class="text-sm font-medium">{{ message.type === 'user' ? 'You' : 'ChefGPT' }}</span>
                </div>
                <div [class]="'whitespace-pre-wrap ' + (message.isError ? 'text-red-600' : 'text-gray-700')"
                     [innerHTML]="formatMessage(message.content)">
                </div>
              </div>
            </div>
            <div *ngIf="isLoading" class="flex items-center gap-2 text-gray-500 p-4">
              <span class="animate-spin">⌛</span>
              <span>{{ thinkingMessage }}</span>
            </div>
          </div>

          <div class="border-t p-4 bg-gray-50">
            <div class="flex gap-2 mb-4">
              <textarea 
                [(ngModel)]="currentMessage"
                (keydown.enter)="$event.preventDefault(); handleSendMessage()"
                placeholder="Type your message to ChefGPT..."
                class="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-12 overflow-hidden">
              </textarea>
              <button 
                (click)="handleSendMessage()"
                class="p-3 bg-blue-500 rounded-lg text-white shadow-md hover:bg-blue-600 transition-colors">
                ➤
              </button>
            </div>
          </div>
        </div>

        <!-- Image Analysis Window -->
        <div *ngIf="activeWindow === 'image'" class="flex-1 overflow-y-auto p-4">
          <div class="flex flex-col items-center">
            <input 
              type="file" 
              accept="image/*" 
              (change)="handleImageChange($event)"
              class="mb-4" 
            />
            <img *ngIf="imageData" 
                 [src]="'data:image/jpeg;base64,' + imageData" 
                 alt="Uploaded preview" 
                 class="max-h-48 mb-4 rounded-md" />
            <button 
              (click)="handleImageSubmit()"
              [disabled]="isImageLoading || !imageData"
              class="px-4 py-2 bg-green-500 text-white rounded">
              {{ isImageLoading ? 'Analyzing...' : 'Analyze Image' }}
            </button>
            <div *ngIf="imageAnalysis" class="mt-4 p-4 bg-gray-100 rounded w-full text-center">
              <p>{{ imageAnalysis }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  isOpen = true;
  activeWindow: 'chat' | 'image' = 'chat';
  messages: Message[] = [{
    id: Date.now(),
    type: 'ai',
    content: '**Hi! I\'m ChefGPT** 🍽️ - Your culinary assistant\n\nI can help with creating detailed recipes and answering food-related questions. Ask me anything about ingredients or cooking techniques!'
  }];
  currentMessage = '';
  isLoading = false;
  thinkingMessage = '';
  
  // Image analysis states
  imageData = '';
  imageAnalysis = '';
  isImageLoading = false;

  private thinkingMessages = [
    "Let me ponder that...", "Thinking out loud...", "Crunching the numbers...",
    "Diving into the data...", "Consulting my algorithms...", "Let me check...",
    "Peeking at the knowledge base...", "Just a moment...", "Whispering to the servers...",
    "Searching my brain..."
  ];

  formatMessage(content: string): string {
    return content.split(/(\*\*.*?\*\*)/).map(part => 
      part.startsWith('**') && part.endsWith('**')
        ? `<strong class="font-semibold">${part.slice(2, -2)}</strong>`
        : part
    ).join('');
  }

  generateThinkingMessage(): string {
    return this.thinkingMessages[Math.floor(Math.random() * this.thinkingMessages.length)];
  }

  async handleSendMessage() {
    if (!this.currentMessage.trim()) return;
    
    this.isLoading = true;
    this.thinkingMessage = this.generateThinkingMessage();
    
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: this.currentMessage
    };
    
    this.messages.push(userMessage);
    const messagesCopy = [...this.messages];
    this.currentMessage = '';

    try {
      const response = await fetch('/.netlify/functions/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesCopy })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const aiResponse = `${data.content}\n\n_— ChefGPT_`;
      
      this.messages.push({
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse
      });
    } catch (error) {
      this.messages.push({
        id: Date.now(),
        type: 'ai',
        content: "⚠️ Hmm, I'm having trouble connecting. Please try again later!",
        isError: true
      });
    } finally {
      this.isLoading = false;
    }
  }

  handleImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result.startsWith('data:')) {
          this.imageData = result.split(',')[1];
        } else {
          this.imageData = result;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  async handleImageSubmit() {
    if (!this.imageData) return;
    
    this.isImageLoading = true;
    this.imageAnalysis = '';
    
    try {
      const response = await fetch('/.netlify/functions/moondream-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: this.imageData })
      });

      if (!response.ok) throw new Error('Image analysis request failed');

      const data = await response.json();
      this.imageAnalysis = data.caption;
    } catch (error) {
      this.imageAnalysis = "⚠️ I'm having trouble processing the image.";
    } finally {
      this.isImageLoading = false;
    }
  }
}