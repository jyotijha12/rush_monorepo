rush init
rm -rf .travis.yml
git init
git add .
git commit -m "Initial commit"
git push origin main
git subtree add --prefix apps/react-app https://github.com/CAI-TECHNOLOGIES/exl-ds-absa-ui main

apps/react-app is used to specify the path inside of the monorepo where the project will be imported.

https://github.com/CAI-TECHNOLOGIES/exl-ds-absa-ui is the remote repository URL of the project we want to import.

main is the branch from where the project will be imported.

rush update - to install the dependencies of react-app project



