import torch
import torch.nn as nn
from transformers import (
    AutoTokenizer, AutoModelForCausalLM,
    BlipProcessor, BlipForConditionalGeneration,
    pipeline, BartTokenizer, BartForConditionalGeneration,
    T5Tokenizer, T5ForConditionalGeneration,
    GPT2LMHeadModel, GPT2Tokenizer,
    AutoModelForSeq2SeqLM
)
from diffusers import StableDiffusionPipeline, DiffusionPipeline, AutoPipelineForText2Image
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import io
import base64
import json
import re
import requests
from typing import Dict, List, Optional, Tuple, Any
import warnings
import time
import os
from datetime import datetime
warnings.filterwarnings('ignore')

class AdvancedClassroomAI:
    """
    Advanced AI Assistant for Classrooms using high-quality pre-trained models
    Optimized for CPU inference with better model choices
    """
    
    def __init__(self, device='cpu', save_images=True, display_images=True):
        self.device = device
        self.conversation_history = []
        self.save_images = save_images
        self.display_images = display_images
        self.models_ready = False  # Initialize as False
        
        # Create directories for saving images
        if self.save_images:
            self.images_dir = "generated_images"
            os.makedirs(self.images_dir, exist_ok=True)
            print(f"📁 Images will be saved to: {self.images_dir}/")
        
        print(f"🖥 Initializing Advanced Classroom AI on: {self.device.upper()}")
        print("🚀 Loading state-of-the-art models...")
        
        if self.device == 'cpu':
            torch.set_num_threads(2)  
            torch.set_grad_enabled(False)  
        
        # Initialize models with error handling
        try:
            self.setup_advanced_models()
            self.models_ready = True  # Only set to True if setup succeeds
            print("✅ All models initialized successfully!")
        except Exception as e:
            print(f"❌ Failed to initialize models: {e}")
            self.models_ready = False
        
    def setup_advanced_models(self):
        """Setup high-quality models optimized for CPU with better error handling"""
        
        # Initialize all model references to None first
        self.text_tokenizer = None
        self.text_model = None
        self.chat_tokenizer = None
        self.chat_model = None
        self.subject_classifier = None
        self.qa_pipeline = None
        self.summarizer = None
        self.image_pipeline = None
        self.image_processor = None
        self.image_caption_model = None
        
        try:
            print("📝 Loading advanced text generation model...")
            self.text_tokenizer = T5Tokenizer.from_pretrained('google/flan-t5-base')
            self.text_model = T5ForConditionalGeneration.from_pretrained(
                'google/flan-t5-base',
                torch_dtype=torch.float32,
                device_map=None
            )
            self.text_model.to(self.device)
            self.text_model.eval()
            print("✅ Text generation model loaded")
            
        except Exception as e:
            print(f"⚠️ Text generation model failed: {e}")
            # Continue with other models
        
        try:
            print("🧠 Loading conversational AI model...")
            self.chat_tokenizer = AutoTokenizer.from_pretrained('microsoft/DialoGPT-medium')
            self.chat_model = AutoModelForCausalLM.from_pretrained(
                'microsoft/DialoGPT-medium',
                torch_dtype=torch.float32,
                device_map=None
            )
            self.chat_model.to(self.device)
            self.chat_model.eval()
            
            if self.chat_tokenizer.pad_token is None:
                self.chat_tokenizer.pad_token = self.chat_tokenizer.eos_token
            print("✅ Conversational AI model loaded")
            
        except Exception as e:
            print(f"⚠️ Conversational AI model failed: {e}")
        
        try:
            print("🔍 Loading subject classification model...")
            self.subject_classifier = pipeline(
                "zero-shot-classification",
                model="microsoft/deberta-v3-base",
                device=-1,
                torch_dtype=torch.float32
            )
            print("✅ Subject classifier loaded")
            
        except Exception as e:
            print(f"⚠️ Subject classifier failed: {e}")
        
        try:
            print("❓ Loading question-answering model...")
            self.qa_pipeline = pipeline(
                "question-answering",
                model="deepset/roberta-base-squad2",
                device=-1,
                torch_dtype=torch.float32
            )
            print("✅ QA pipeline loaded")
            
        except Exception as e:
            print(f"⚠️ QA pipeline failed: {e}")
        
        try:
            print("📊 Loading text summarization model...")
            self.summarizer = pipeline(
                "summarization",
                model="facebook/bart-base",
                device=-1,
                torch_dtype=torch.float32
            )
            print("✅ Summarizer loaded")
            
        except Exception as e:
            print(f"⚠️ Summarizer failed: {e}")
        
        try:
            print("🎨 Loading image generation model...")
            self.image_pipeline = AutoPipelineForText2Image.from_pretrained(
                "runwayml/stable-diffusion-v1-5",
                torch_dtype=torch.float32,
                use_safetensors=True,
                variant=None
            )
            self.image_pipeline = self.image_pipeline.to(self.device)
            print("✅ Image generation model loaded")
            
        except Exception as e:
            print(f"⚠️ Image generation model failed: {e}")
        
        try:
            print("🖼 Loading image captioning model...")
            self.image_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
            self.image_caption_model = BlipForConditionalGeneration.from_pretrained(
                "Salesforce/blip-image-captioning-base",
                torch_dtype=torch.float32
            )
            self.image_caption_model.to(self.device)
            self.image_caption_model.eval()
            print("✅ Image captioning model loaded")
            
        except Exception as e:
            print(f"⚠️ Image captioning model failed: {e}")
        
        # Check if at least core models are available
        core_models_available = (
            self.text_tokenizer is not None and 
            self.text_model is not None
        )
        
        if not core_models_available:
            raise Exception("Critical models failed to load")
        
        print("✅ Model setup completed!")
    
    def analyze_educational_query(self, query: str) -> Dict[str, Any]:
        """Advanced query analysis using AI models with fallback"""
        
        print(f"🔍 Analyzing query: {query}")
        
        try:
            # Use AI classification if available
            if self.subject_classifier is not None:
                subjects = [
                    'mathematics', 'physics', 'chemistry', 'biology', 'history', 
                    'geography', 'literature', 'computer science', 'economics',
                    'psychology', 'philosophy', 'art', 'music', 'environmental science'
                ]
                
                classification_result = self.subject_classifier(query, subjects)
                subject = classification_result['labels'][0]
                confidence = classification_result['scores'][0]
            else:
                # Fallback to keyword-based classification
                subject, confidence = self._fallback_subject_classification(query)
            
            # Query type analysis
            query_lower = query.lower()
            
            if any(word in query_lower for word in ['explain', 'what is', 'define', 'describe', 'tell me about']):
                query_type = 'explanation'
            elif any(word in query_lower for word in ['solve', 'calculate', 'find', 'compute']):
                query_type = 'problem_solving'
            elif any(word in query_lower for word in ['compare', 'difference', 'versus', 'vs', 'contrast']):
                query_type = 'comparison'
            elif any(word in query_lower for word in ['show', 'draw', 'create', 'generate', 'visualize']):
                query_type = 'visualization'
            elif any(word in query_lower for word in ['how to', 'steps', 'procedure', 'process']):
                query_type = 'tutorial'
            else:
                query_type = 'general'
            
            needs_visual = any(word in query_lower for word in [
                'show', 'draw', 'diagram', 'chart', 'graph', 'visual', 'picture', 
                'image', 'illustrate', 'create image', 'generate picture'
            ])
            
            analysis = {
                'subject': subject,
                'confidence': confidence,
                'query_type': query_type,
                'needs_visual': needs_visual,
                'complexity': self._assess_complexity(query),
                'educational_level': self._determine_educational_level(query)
            }
            
            print(f"✅ Analysis completed: {analysis}")
            return analysis
            
        except Exception as e:
            print(f"⚠️ Analysis error: {e}, using fallback analysis")
            return self._fallback_analysis(query)
    
    def _fallback_subject_classification(self, query: str) -> Tuple[str, float]:
        """Fallback subject classification using keywords"""
        query_lower = query.lower()
        
        subject_keywords = {
            'mathematics': ['math', 'equation', 'number', 'calculate', 'algebra', 'geometry', 'calculus'],
            'physics': ['force', 'energy', 'motion', 'wave', 'particle', 'gravity', 'physics'],
            'chemistry': ['chemical', 'molecule', 'atom', 'reaction', 'compound', 'element'],
            'biology': ['cell', 'organism', 'dna', 'genetics', 'evolution', 'biology'],
            'history': ['historical', 'past', 'ancient', 'war', 'civilization', 'century'],
            'geography': ['country', 'continent', 'climate', 'map', 'location', 'geography'],
            'literature': ['poem', 'story', 'novel', 'author', 'literature', 'writing'],
            'computer science': ['code', 'program', 'algorithm', 'computer', 'software', 'data']
        }
        
        scores = {}
        for subject, keywords in subject_keywords.items():
            score = sum(1 for keyword in keywords if keyword in query_lower)
            if score > 0:
                scores[subject] = score / len(keywords)
        
        if scores:
            best_subject = max(scores, key=scores.get)
            return best_subject, scores[best_subject]
        else:
            return 'general', 0.5
    
    def _assess_complexity(self, query: str) -> str:
        """Assess query complexity"""
        query_lower = query.lower()
        
        advanced_terms = ['theorem', 'hypothesis', 'methodology', 'analysis', 'synthesis', 'evaluation']
        intermediate_terms = ['process', 'relationship', 'comparison', 'function', 'structure']
        basic_terms = ['what', 'who', 'when', 'where', 'simple', 'basic']
        
        if any(term in query_lower for term in advanced_terms):
            return 'advanced'
        elif any(term in query_lower for term in intermediate_terms):
            return 'intermediate'
        else:
            return 'basic'
    
    def _determine_educational_level(self, query: str) -> str:
        """Determine appropriate educational level"""
        query_lower = query.lower()
        
        if any(term in query_lower for term in ['university', 'college', 'advanced', 'research']):
            return 'university'
        elif any(term in query_lower for term in ['high school', 'secondary', 'algebra', 'calculus']):
            return 'high_school'
        elif any(term in query_lower for term in ['middle school', 'junior', 'basic']):
            return 'middle_school'
        else:
            return 'general'
    
    def _fallback_analysis(self, query: str) -> Dict[str, Any]:
        """Fallback analysis when AI models fail"""
        subject, confidence = self._fallback_subject_classification(query)
        
        return {
            'subject': subject,
            'confidence': confidence,
            'query_type': 'explanation',
            'needs_visual': 'visual' in query.lower() or 'show' in query.lower(),
            'complexity': self._assess_complexity(query),
            'educational_level': self._determine_educational_level(query)
        }
    
    def generate_educational_response(self, query: str, analysis: Dict[str, Any]) -> str:
        """Generate educational response with fallback options"""
        
        try:
            # Try to use AI models if available
            if self.text_tokenizer is not None and self.text_model is not None:
                return self._generate_ai_response(query, analysis)
            else:
                print("⚠️ AI models not available, using fallback response")
                return self._generate_fallback_response(query, analysis)
                
        except Exception as e:
            print(f"❌ Response generation error: {e}")
            return self._generate_fallback_response(query, analysis)
    
    def _generate_ai_response(self, query: str, analysis: Dict[str, Any]) -> str:
        """Generate response using AI models"""
        
        if analysis['query_type'] == 'explanation':
            prompt = f"Explain in detail for {analysis['educational_level']} students: {query}"
        elif analysis['query_type'] == 'problem_solving':
            prompt = f"Solve this {analysis['subject']} problem step by step: {query}"
        elif analysis['query_type'] == 'comparison':
            prompt = f"Compare and contrast the following for students: {query}"
        elif analysis['query_type'] == 'tutorial':
            prompt = f"Provide a step-by-step tutorial for: {query}"
        else:
            prompt = f"Provide a comprehensive educational answer about: {query}"
        
        tokenized = self.text_tokenizer(
            prompt,
            return_tensors='pt',
            max_length=512,
            truncation=True,
            padding=True,
            return_attention_mask=True  # Explicitly request attention mask
        )
        
        inputs = tokenized['input_ids'].to(self.device)
        attention_mask = tokenized['attention_mask'].to(self.device)
        
        with torch.no_grad():
            outputs = self.text_model.generate(
                inputs,
                attention_mask=attention_mask,  # Pass attention mask
                max_length=300,
                min_length=50,
                num_beams=4,
                temperature=0.7,
                do_sample=True,
                top_p=0.9,
                repetition_penalty=1.1,
                early_stopping=True,
                pad_token_id=self.text_tokenizer.eos_token_id
            )
        
        response = self.text_tokenizer.decode(outputs[0], skip_special_tokens=True)
        response = response.replace(prompt, "").strip()
        
        if len(response) < 100:
            response = self._enhance_with_conversational_model(query, response)
        
        return response
    
    def _enhance_with_conversational_model(self, query: str, base_response: str) -> str:
        """Enhance response using conversational model"""
        try:
            if self.chat_tokenizer is None or self.chat_model is None:
                return base_response
            
            context = f"User: {query}\nAssistant: {base_response}\nUser: Can you elaborate more?\nAssistant:"
            
            tokenized = self.chat_tokenizer(
                context,
                return_tensors='pt',
                max_length=400,
                truncation=True,
                padding=True,
                return_attention_mask=True
            )
            
            inputs = tokenized['input_ids'].to(self.device)
            attention_mask = tokenized['attention_mask'].to(self.device)
            
            with torch.no_grad():
                outputs = self.chat_model.generate(
                    inputs,
                    attention_mask=attention_mask,  # Pass attention mask
                    max_length=inputs.shape[1] + 100,
                    num_beams=3,
                    temperature=0.8,
                    do_sample=True,
                    top_p=0.9,
                    pad_token_id=self.chat_tokenizer.eos_token_id,
                    eos_token_id=self.chat_tokenizer.eos_token_id
                )
            
            enhanced = self.chat_tokenizer.decode(outputs[0][inputs.shape[1]:], skip_special_tokens=True)
            
            return f"{base_response}\n\n{enhanced.strip()}"
            
        except Exception as e:
            print(f"⚠️ Enhancement failed: {e}")
            return base_response
    
    def _generate_fallback_response(self, query: str, analysis: Dict[str, Any]) -> str:
        """Generate fallback response when AI models fail"""
        
        subject = analysis['subject']
        query_type = analysis['query_type']
        complexity = analysis['complexity']
        level = analysis['educational_level']
        
        if query_type == 'explanation':
            return f"Let me explain {subject} concepts related to your question about '{query}'. This appears to be a {complexity}-level question suitable for {level} students. I'll break this down step by step to help you understand the key concepts and principles involved."
        
        elif query_type == 'problem_solving':
            return f"To solve this {subject} problem, I'll walk you through the solution step by step. For a {complexity}-level problem like this, we need to identify the key information, choose the appropriate method, and work through the solution systematically."
        
        elif query_type == 'comparison':
            return f"I'll help you compare and contrast the different aspects of your {subject} question. This type of analysis requires us to examine similarities, differences, and relationships between the concepts you're asking about."
        
        elif query_type == 'tutorial':
            return f"I'll provide you with a step-by-step tutorial for this {subject} topic. This {complexity}-level guide will help {level} students understand the process and methodology involved."
        
        else:
            return f"I understand you're asking about {subject}. This is a {complexity}-level question that I'll help you understand. Let me provide you with a comprehensive explanation that covers the key concepts and helps you grasp the fundamental principles involved."
    
    def generate_educational_visual(self, query: str, analysis: Dict[str, Any]) -> Optional[Image.Image]:
        """Generate educational visuals with fallback"""
        
        if not analysis['needs_visual']:
            return None
        
        try:
            if self.image_pipeline is not None:
                print("🎨 Generating educational visual with AI...")
                return self._generate_ai_visual(query, analysis)
            else:
                print("🎨 Generating fallback visual...")
                return self._generate_fallback_visual(query, analysis)
                
        except Exception as e:
            print(f"❌ Visual generation error: {e}")
            return self._generate_fallback_visual(query, analysis)
    
    def _generate_ai_visual(self, query: str, analysis: Dict[str, Any]) -> Optional[Image.Image]:
        """Generate visual using AI models"""
        
        visual_prompt = self._construct_visual_prompt(query, analysis)
        print(f"🖼️ Visual prompt: {visual_prompt}")
        
        with torch.no_grad():
            image = self.image_pipeline(
                prompt=visual_prompt,
                num_inference_steps=20,
                guidance_scale=7.5,
                height=512,
                width=512,
                generator=torch.Generator(device=self.device).manual_seed(42)
            ).images[0]
        
        enhanced_image = self._enhance_educational_image(image, query)
        
        # Save and display the image
        image_path = self._save_image(enhanced_image, query, analysis)
        self._display_image(enhanced_image, image_path)
        
        print("✅ Educational visual generated successfully!")
        return enhanced_image
    
    def _construct_visual_prompt(self, query: str, analysis: Dict[str, Any]) -> str:
        """Construct optimized prompt for educational visual generation"""
        
        subject = analysis['subject']
        query_lower = query.lower()
        
        base_prompt = "educational illustration, clean design, professional diagram, textbook style, clear and simple"
        
        subject_prompts = {
            'mathematics': "mathematical diagram, geometric shapes, clean whiteboard, equations, graphs",
            'physics': "physics diagram, scientific illustration, forces and motion, clean background",
            'chemistry': "molecular structure, chemical bonds, scientific diagram, laboratory style",
            'biology': "biological illustration, anatomical diagram, cell structure, scientific poster",
            'history': "historical illustration, timeline, educational infographic, documentary style",
            'geography': "map, geographical features, educational poster, atlas style",
            'computer science': "flowchart, algorithm diagram, programming concept, technical illustration"
        }
        
        subject_enhancement = subject_prompts.get(subject, "educational diagram, informative illustration")
        
        key_concepts = self._extract_key_concepts(query)
        
        visual_prompt = f"{key_concepts}, {subject_enhancement}, {base_prompt}, high quality, detailed"
        
        return visual_prompt
    
    def _extract_key_concepts(self, query: str) -> str:
        """Extract key visual concepts from query"""
        stop_words = {'what', 'is', 'how', 'does', 'the', 'a', 'an', 'of', 'to', 'and', 'or', 'but', 'in', 'on', 'at', 'for', 'with', 'by'}
        
        words = query.lower().split()
        key_words = [word for word in words if word not in stop_words and len(word) > 2]
        
        return " ".join(key_words[:5])
    
    def _enhance_educational_image(self, image: Image.Image, query: str) -> Image.Image:
        """Enhance generated image for educational use"""
        try:
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            enhancer = ImageEnhance.Contrast(image)
            image = enhancer.enhance(1.2)
            
            enhancer = ImageEnhance.Sharpness(image)
            image = enhancer.enhance(1.1)
            
            width, height = image.size
            border_width = 10
            
            bordered_image = Image.new('RGB', (width + 2*border_width, height + 2*border_width), 'white')
            bordered_image.paste(image, (border_width, border_width))
            
            return bordered_image
            
        except Exception as e:
            print(f"⚠️ Image enhancement failed: {e}")
            return image
    
    def _generate_fallback_visual(self, query: str, analysis: Dict[str, Any]) -> Optional[Image.Image]:
        """Generate simple fallback visual when AI generation fails"""
        try:
            img = Image.new('RGB', (512, 512), 'white')
            draw = ImageDraw.Draw(img)
            
            title = f"{analysis['subject'].title()} Concept"
            
            try:
                font = ImageFont.truetype("arial.ttf", 24)
                small_font = ImageFont.truetype("arial.ttf", 16)
            except:
                font = ImageFont.load_default()
                small_font = ImageFont.load_default()
            
            bbox = draw.textbbox((0, 0), title, font=font)
            text_width = bbox[2] - bbox[0]
            text_x = (512 - text_width) // 2
            
            draw.text((text_x, 50), title, fill='black', font=font)
            
            query_lines = self._wrap_text(query, 50)
            y_position = 150
            
            for line in query_lines:
                bbox = draw.textbbox((0, 0), line, font=small_font)
                line_width = bbox[2] - bbox[0]
                line_x = (512 - line_width) // 2
                draw.text((line_x, y_position), line, fill='navy', font=small_font)
                y_position += 30
            
            draw.rectangle([50, 100, 462, 102], fill='blue')
            draw.rectangle([50, 410, 462, 412], fill='blue')
            
            # Save the fallback image
            image_path = self._save_image(img, query, analysis, is_fallback=True)
            self._display_image(img, image_path)
            
            return img
            
        except Exception as e:
            print(f"❌ Fallback visual generation failed: {e}")
            return None
    
    def _save_image(self, image: Image.Image, query: str, analysis: Dict[str, Any], is_fallback: bool = False) -> str:
        """Save the generated image to disk"""
        if not self.save_images or not image:
            return ""
        
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            subject = analysis['subject'].replace(' ', '_')
            query_short = ''.join(c for c in query[:30] if c.isalnum() or c in (' ', '-', '_')).rstrip()
            query_short = query_short.replace(' ', '_')
            
            fallback_suffix = "_fallback" if is_fallback else ""
            filename = f"{timestamp}_{subject}_{query_short}{fallback_suffix}.png"
            
            if len(filename) > 200:
                filename = f"{timestamp}_{subject}{fallback_suffix}.png"
            
            image_path = os.path.join(self.images_dir, filename)
            
            image.save(image_path, "PNG", quality=95)
            print(f"💾 Image saved: {image_path}")
            
            return image_path
            
        except Exception as e:
            print(f"❌ Failed to save image: {e}")
            return ""
    
    def _display_image(self, image: Image.Image, image_path: str):
        """Display the generated image - skipped in API mode"""
        if not self.display_images:
            return
        
        try:
            plt.figure(figsize=(10, 8))
            plt.imshow(image)
            plt.axis('off')
            plt.title('Generated Educational Visual', fontsize=14, fontweight='bold')
            
            if image_path:
                plt.figtext(0.5, 0.02, f'Saved as: {os.path.basename(image_path)}', 
                        ha='center', fontsize=10, style='italic')
            
            plt.tight_layout()
            plt.show()
            
            print("🖼️ Image displayed successfully!")
            
        except Exception as e:
            print(f"⚠️ Could not display image: {e}")
            print(f"📁 Image saved to: {image_path}")
    
    def _wrap_text(self, text: str, max_length: int) -> List[str]:
        """Wrap text to specified length"""
        words = text.split()
        lines = []
        current_line = []
        current_length = 0
        
        for word in words:
            if current_length + len(word) + 1 <= max_length:
                current_line.append(word)
                current_length += len(word) + 1
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                current_line = [word]
                current_length = len(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines
    
    def process_educational_query(self, query: str) -> Dict[str, Any]:
        """Main method to process educational queries with comprehensive error handling"""
        
        print(f"\n🎓 Processing Educational Query: {query}")
        print("=" * 80)
        
        start_time = time.time()
        
        try:
            # Analyze the query
            analysis = self.analyze_educational_query(query)
            
            print(f"📊 Analysis Results:")
            print(f"   Subject: {analysis['subject']} (confidence: {analysis['confidence']:.2f})")
            print(f"   Type: {analysis['query_type']}")
            print(f"   Complexity: {analysis['complexity']}")
            print(f"   Level: {analysis['educational_level']}")
            print(f"   Needs Visual: {analysis['needs_visual']}")
            
            # Generate text response
            print("\n📝 Generating educational response...")
            text_response = self.generate_educational_response(query, analysis)
            
            # Generate visual if needed
            visual_image = None
            if analysis['needs_visual']:
                print("\n🎨 Generating educational visual...")
                visual_image = self.generate_educational_visual(query, analysis)
            
            processing_time = time.time() - start_time
            
            # Add to conversation history
            self.conversation_history.append({
                'query': query,
                'response': text_response,
                'analysis': analysis,
                'timestamp': time.time(),
                'processing_time': processing_time,
                'has_visual': visual_image is not None
            })
            
            print(f"\n✅ Processing completed in {processing_time:.2f} seconds")
            print("=" * 80)
            
            return {
                'text_response': text_response,
                'visual_image': visual_image,
                'analysis': analysis,
                'processing_time': processing_time,
                'success': True
            }
            
        except Exception as e:
            print(f"❌ Error processing query: {e}")
            processing_time = time.time() - start_time
            
            # Return error response
            return {
                'text_response': f"I encountered an error processing your question about '{query}'. Please try rephrasing your question or try again later.",
                'visual_image': None,
                'analysis': {'subject': 'unknown', 'error': str(e)},
                'processing_time': processing_time,
                'success': False,
                'error': str(e)
            }