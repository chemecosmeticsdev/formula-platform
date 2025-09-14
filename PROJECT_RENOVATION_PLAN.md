# Project Renovation Plan: Formula Platform with AWS Integration & Thai Language Support

## Current State Analysis
- **Existing Formula Platform**: Next.js app with Prisma/PostgreSQL, currently using AbacusAI for text generation
- **Legacy Issue**: Old APIs no longer work (AbacusAI integration needs replacement)
- **Infrastructure**: AWS credentials configured for ap-southeast-1 (default) and us-east-1 (Bedrock)

## Key Requirements & Changes

### 1. **AWS Integration Overhaul**
- **Text Generation**: Replace AbacusAI with **AWS Nova Lite** (cost-effective, fast)
- **Image Generation**: Implement **Amazon Nova Canvas** (amazon.nova-canvas-v1:0) via AWS Bedrock in us-east-1
- **Future-Proof Design**: Create modular image generation service to easily swap to Google Nanobanana later

### 2. **Thai Language Support**
- Add Thai language localization throughout the UI
- Ensure AWS Nova Lite handles Thai text generation properly
- Update input forms and result displays for bilingual support

### 3. **Database & Storage Strategy**
- **Remove Database Dependency**: As per requirements, no data storage in database
- Remove Prisma schema and database calls
- Store generated results temporarily in memory/session only

### 4. **Architecture Improvements**
- Clean, modular API design for easy model switching
- Remove old AbacusAI integration completely
- Implement proper error handling and retry mechanisms

## Implementation Steps

### Phase 1: AWS Services Setup
1. Install AWS SDK and configure Bedrock client for us-east-1
2. Create AWS service modules for Nova Lite (text) and Nova Canvas (image)
3. Test API connections and authentication

### Phase 2: Database Removal & API Refactoring
4. Remove Prisma schema and database dependencies
5. Refactor `/api/generate` and `/api/results` to work without database
6. Implement session-based result storage

### Phase 3: Thai Language Integration
7. Add internationalization support (next-i18next or similar)
8. Create Thai translations for all UI components
9. Update prompts for Nova Lite to handle Thai language

### Phase 4: Image Generation Integration
10. Build modular image generation service with Nova Canvas
11. Design API structure to easily switch to Google Nanobanana
12. Add image generation to formula concept results

### Phase 5: Testing & Deployment Prep
13. Local testing with both English and Thai content
14. Performance optimization and error handling
15. Prepare AWS Amplify deployment configuration

## Deliverables
- ✅ Working Next.js app with AWS Nova Lite text generation
- ✅ AWS Nova Canvas image generation integration
- ✅ Full Thai language support
- ✅ No database dependencies (memory-only storage)
- ✅ Modular architecture ready for Google Nanobanana upgrade
- ✅ AWS Amplify deployment instructions

## Technical Stack
- **Framework**: Next.js 14 (existing)
- **Text AI**: AWS Nova Lite via Bedrock
- **Image AI**: Amazon Nova Canvas via Bedrock
- **Internationalization**: React-intl or next-i18next
- **AWS SDK**: @aws-sdk/client-bedrock-runtime
- **Deployment**: AWS Amplify (instructions provided)

## AWS Models Research

### AWS Nova Lite (Text Generation)
- Cost-effective text generation model
- Supports 200+ languages including Thai
- Available in us-east-1 via Bedrock
- Model ID: `amazon.nova-lite-v1:0`

### Amazon Nova Canvas (Image Generation)
- State-of-the-art image generation
- Available in us-east-1 via Bedrock
- Model ID: `amazon.nova-canvas-v1:0`
- Features: Text-to-image, image editing, style control

### Google Nanobanana (Future Upgrade)
- Google's Gemini 2.5 Flash Image (codename: Nanobanana)
- Advanced capabilities: character consistency, multi-image fusion
- API: Google AI Studio / Vertex AI
- Pricing: $0.039 per image
- Available via Google AI API

## File Structure Changes
```
formula_platform/app/
├── lib/
│   ├── aws/
│   │   ├── bedrock-client.ts
│   │   ├── nova-lite.ts
│   │   └── nova-canvas.ts
│   ├── services/
│   │   ├── text-generation.ts
│   │   └── image-generation.ts
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en.json
│   │   │   └── th.json
│   │   └── config.ts
│   └── session-storage.ts
├── app/api/
│   ├── generate/route.ts (updated)
│   └── results/route.ts (updated)
└── components/
    ├── language-switcher.tsx
    └── ui/ (existing components)
```

Ready to proceed with implementation!