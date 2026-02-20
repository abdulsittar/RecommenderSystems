Website: [https://socialapp2.ijs.si/](https://socialapp2.ijs.si/)

# Recommender systems platform by TWON

A social media research platform for studying polarization and news consumption behavior. Built with the MERN stack (MongoDB, Express, React, Node.js), this application presents participants with news articles on controversial topics and tracks their reading behavior and stance evolution across multiple sessions.

## Research Features

### Study Design
- **Multi-session study**: Participants complete 2+ sessions with auto-login between sessions
- **Topic focus**: Abortion, Military Armament, and Social Media Regulation
- **Article tracking**: Monitors which articles participants read and engagement metrics
- **Control groups**: Randomized assignment to control, edge, or center recommendation algorithms
- **Stance measurement**: Pre and post-surveys measure participants' positions on controversial topics

### Participant Flow
1. **Registration**: Unique Prolific links with UUID-based authentication
2. **Consent & Pre-survey**: Simplified 1-click consent and demographic/stance survey
3. **Session 1**: Read 5 articles, tracked via `sessionReadPosts`
4. **Session 2**: Auto-login, read 5 more articles
5. **Post-survey**: 13-question survey measuring stance changes
6. **Completion**: Prolific code displayed for participant payment

### Recommendation Algorithms
- **Control Group**: Articles within participant's Overton window, ranked by relevance
- **Edge Group**: Articles from edges of Overton window and beyond
- **Center Group**: Articles moving toward centrist positions

### Data Tracking
- Article views and read time
- User interactions (likes, dislikes, comments)
- Session progression and completion rates
- Stance scores and Overton window calculations
- Recommendation logs for algorithm evaluation


## Technical Stack

- **Frontend**: React 17+, Material-UI, React Router
- **Backend**: Node.js, Express, JWT authentication
- **Database**: MongoDB with Mongoose ODM
- **Article Data**: CSV-based article corpus with perspective scores
- **Deployment**: Docker-ready with nginx reverse proxy

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Environment Configuration

**Server (.env in `/server`):**
```
DB_CONNECT=mongodb://your-mongodb-url
JWT_SECRET=your-jwt-secret
PORT=1075
```

**Client (config.js in `/client`):**
```javascript
export const API_URL = 'https://your-domain.com' || 'http://localhost:1075';
```

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RecommenderSystems
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

3. **Start the server** (from `/server` directory)
   ```bash
   npm start
   # Server runs on port 1075
   ```

4. **Build and serve the client** (from `/client` directory)
   ```bash
   npm run build
   # Built files served by Express from server/public
   ```

5. **Access the application**
   - Open browser to `http://localhost:1075` or your configured domain

### Docker Deployment

```bash
docker-compose up -d
```

The `docker-compose.yml` includes services for both client and server.

## Key Configuration Files

- `/server/routes/users.js` - getUserActions endpoint for session progression logic
- `/server/routes/auth.js` - Login and control group assignment
- `/server/routes/postsurvey.js` - Post-survey submission and Prolific code
- `/server/services/recommendationService.js` - Algorithm implementations
- `/client/src/components/feed/Feed.js` - Article feed and session tracking
- `/client/src/components/post/Post.js` - Article view tracking
- `/client/src/pages/postsurvey/PostSurveySimplified.js` - Post-survey interface

## Screenshots

### Participant Journey

**1. Landing Page - Registration with Unique Link**
![Landing Page](screenshots/recommender%20system%20photos/landiongpage.png)

**2. Consent Form - Simplified Single Checkbox**
![Consent Form](screenshots/recommender%20system%20photos/consentform.png)

**3. Pre-Survey - Demographics and Stance Questions**
![Pre-Survey](screenshots/recommender%20system%20photos/presurvey.png)

**4. Topic Selection - Three Available Topics**
![Topic Selection](screenshots/recommender%20system%20photos/selecttopic.png)

**5. Main Feed - Articles with Read Indicators**
![Main Feed](screenshots/recommender%20system%20photos/feed.png)

**6. Article View - In-App Web View**
![Article View](screenshots/recommender%20system%20photos/article.png)

**7. Session 2 Welcome - Returning User Dialog**
![Session 2 Welcome](screenshots/recommender%20system%20photos/session2.png)

**8. Thank You Page - Between Sessions**
![Thank You Page](screenshots/recommender%20system%20photos/thankyoupage.png)

**9. Post-Survey - Topic-Specific Questions**
![Post-Survey](screenshots/recommender%20system%20photos/postsurvey.png)

**10. Topic Survey - Additional Survey View**
![Topic Survey](screenshots/recommender%20system%20photos/topicsurvey.png)

**11. Completion - Prolific Code Display**
![Prolific Code](screenshots/recommender%20system%20photos/end_prolificid.png)

## License

Research project by TWON team at Institut Jožef Stefan.

## Contact

For questions about the research platform, contact the TWON research team.


