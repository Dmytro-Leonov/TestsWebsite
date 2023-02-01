# Features of Tests Website that I'd like to implement

Features that may not come to life in this project, but I'd still like to implement, are indicated with a question mark

### Guest User
- **Auth:**
  - [ ] Login or Register with Google Account
  - [ ] ? Login or Register with Email
- [ ] ? Create a quick test without registration with sharable link that expires after a certain time
- [ ] View information about subscription plans

### Authenticated User
- **Auth:**
  - [ ] Logout
- **Tests:**
  - **Create question pool for test:**
    - [ ] Add questions to pool
    - [ ] Edit questions in pool
    - [ ] Delete questions from pool
  - [ ] Create groups of students and assign them to tests
    - [ ] Add students to group
    - [ ] Delete students from group
  - **Create test:**
    - [ ] Add questions from pool to test
    - [ ] Edit questions in test
    - [ ] Delete questions from test
    - **Edit test settings:**
      - [ ] Test name
      - [ ] Start date
      - [ ] End date
      - [ ] Time limit
      - [ ] Give extra time
      - [ ] Allowed attempts
      - [ ] Shuffle questions
      - [ ] Shuffle answers
      - [ ] Show user answers after test
      - [ ] Show correct answers after test
      - [ ] Show score after test
      - [ ] Show time taken after test
  - [ ] Delete test 
  - View test results:
    - [ ] General results
    - [ ] ? Mark tests completed from the same IP address
    - [ ] ? Mark tests completed from the same device
    - **Results for a specific user:**
      - [ ] Total score for test
      - [ ] Score for each question
      - [ ] Total time taken for test
      - [ ] Time spent on each question
      - **Activity logs that show time of following actions:**
        - [ ] Test started
        - [ ] Test ended
        - [ ] Question entered
        - [ ] Question answered
        - [ ] Answer to a question changed
        - [ ] Question or it's part copied
        - [ ] ? Answer to a question copied
        - [ ] Switched to another tab
        - [ ] Switched back to test tab
    - **? Test stats:**
      - [ ] Average score
      - [ ] Average time taken
      - [ ] Average time spent on each question
      - [ ] Right answers percentage for the test
      - [ ] Right answers percentage for each question
      - [ ] Count of how many times an answer was chosen for each question
- **Subscription:**
  - [ ] ? Subscribe to a plan for himself
  - [ ] ? Subscribe to a plan for an organization
  - [ ] ? Cancel subscription
  - [ ] ? Change subscription plan
  - [ ] ? View subscription details

### Admin User
- [ ] ? Create custom subscription plans