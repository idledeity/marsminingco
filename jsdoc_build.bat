@ECHO OFF
@ECHO Deleting /docs
rd /s /q docs
@ECHO Building JSDocs
CALL jsdoc scripts -r -d docs
@ECHO Done
TIMEOUT /t 5
