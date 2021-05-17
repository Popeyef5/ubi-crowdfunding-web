# UBI Crowdfunding Web

Hi! Welcome to the repository for the UBI Crowdfunding protocol. You can access the live site here:<br/>

[https://ubicrowd.fund](https://ubicrowd.fund)

## What is UBI?

Strange that you got here without knowing that, but here goes a one-liner: the UBI project is an ambitious
quest to leverage blockchain technology and consensus mechanisms to provide each unique existing individual with a basic income, no strings
attached. You can learn more about the initiative here: <br/>

[https://proofofhumanity.id](https://proofofhumanity.id)

## What is UBI Crowdfunding?

UBI Crowdfunding is a simple protocol designed to onboard as many people as possible to UBI. It's raison-d'être is the fact that, for security reasons, in order to apply for UBI, a (substantial) safety deposit has to be made. Most people, especially people who need UBI the most, don't have access to such funds! UBI Crowdfunding to the rescue. The protocol is a communitary and collaborative effort that allows for people with sufficient means to donate/share money (as much as they want/can) for others to use as a deposit.

### How does it work?

The elevator pitch goes like this:<br/>

“On one side, people who need funding sign up on a website and only their relevant data (PoH profile, etc) is stored in a database. All applicants are ordered
dynamically according to simple rules and this data can be accessed through a
simple REST API. On the other side, money (of many possible sources) is deposited in a multisig wallet, the Vault, with n trusted owners, the Guardians.
Guardians run a bot that continuously queries the API for instructions on who
gets to be funded next and proceed to sign off on the relevant transactions between
the wallet and the PoH SC. Profiles are therefore continuously being registered
and funded.”

You can read it more in detail in the [litepaper](https://ubicrowd.fund/litepaper.pdf)

## How can I help?

That's very nice of you to ask. Here are a couple of ways.

### Debug

Break the site! Grab it, twist it, punch it, push it, spin it. Whatever bugs you find are less bugs experienced by actual users. Please create an issue here if you happen to come accross one.

### Contribute Ideas

Think of ways to improve the protocol. Not only on a codebase level but on a higher level as well. A few topics that could use additional brain power are:
* How do we create a completely decentralized protocol that is not extra expensive?
* How do we make it so that the gas fees don't drain the donations?
* How do we promote people onboarding and using UBI Crowdfunder?

### Distribute

Marketing is a huge side of the project. The tech might be cool and all, but it needs to get to people FAST! If you can add any distribution channel, it's be much appreciated.

### Contribute to the repo

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.
2. Create a new branch `git checkout -b MY_BRANCH_NAME`
3. Install the dependencies: `npm install`
5. Install Docker and Docker Compose
6. Run the DB `sudo docker-compose up -d`
7. Run `npm run dev` to build and watch for code changes

### TODOs

Although every cool contribution is welcome, here are a few things on the TODO list that would be nice additions:

* /list loads the lists with GetServerSideProps, which is too slow and results in a bad UX. Would be better to load dynamically.
* The transition from "Apply to Funding" to "My Profile" takes some time and is counterintuitive