# Features of Tests Website that I'd like to implement

**Priorities:**
1. Should be implemented in the first version 
2. Should be implemented in the second version
3. May be implemented if I have time

### Guest User
- **Auth:**
  - [ ] [1] Login or Register with Google Account
  - [ ] [3] Login or Register with Email
- [ ] [3] Create a quick test without registration with sharable link that expires after a certain time
- [ ] [2] View information about subscription plans

### Authenticated User
- **Auth:**
  - [ ] [1] Logout
- **Tests:**
  - **Create question pool for test:**
    - [ ] [1] Add questions to pool
    - [ ] [1] Edit questions in pool
    - [ ] [1] Delete questions from pool
  - [ ] **Create students group:**
    - [ ] [1] Add students to group
    - [ ] [1] Delete students from group
  - **Create test:**
    - [ ] [1] Add questions from pool to test
    - [ ] [1] Assign groups to test
    - [ ] [1] Edit questions in test
    - [ ] [1] Delete questions from test
    - **Edit test settings:**
      - [ ] [1] Test name
      - [ ] [1] Test description
      - [ ] [1] Start date
      - [ ] [1] End date
      - [ ] [1] Time limit
      - [ ] [1] Shuffle answers
      - [ ] [1] Shuffle questions
      - [ ] [1] Give extra time
      - [ ] [1] Allowed attempts
      - [ ] [2] Show user answers after test
      - [ ] [3] Show correct answers after test
      - [ ] [1] Show score after test
      - [ ] [1] Show time taken after test
  - [ ] [1] Delete test 
  - View test results:
    - [ ] [1] General results
    - [ ] [2] Mark tests completed from the same IP address
    - [ ] [2] Mark tests completed from the same device
    - **Results for a specific user:**
      - [ ] [1] Total score for test
      - [ ] [1] Score for each question
      - [ ] [1] Total time taken for test
      - [ ] [3] Time spent on each question
      - **Activity logs that show time of following actions:**
        - [ ] [1] Test started
        - [ ] [1] Test ended
        - [ ] [1] Question entered
        - [ ] [1] Question answered
        - [ ] [1] Answer to a question changed
        - [ ] [2] Tab switched
    - **? Test stats:**
      - [ ] [1] Average score
      - [ ] [1] Average time taken
      - [ ] [3] Average time spent on each question
      - [ ] [2] Right answers percentage for the test
      - [ ] [1] Right answers percentage for each question
      - [ ] [2] Count of how many times an answer was chosen for each question
- **Subscription:**
  - [ ] [1] Subscribe to a plan for himself
  - [ ] [2] Subscribe to a plan for an organization
  - [ ] [1] Cancel subscription
  - [ ] [2] Change subscription plan
  - [ ] [1] View subscription details

### Admin User
- [ ] [3] Create custom subscription plans