#!/bin/sh

FLAG_DDL_MODE=create-drop

if [ "$DDL_MODE" ]; then
	FLAG_DDL_MODE=$DDL_MODE
fi

# print all environment variables
if [ "$PRINT_ENV" ]; then
	printenv | column -t -s'='
fi

COMMAND_LINE="java $ADDITIONAL_JAVA_ARG -Dspring.jpa.hibernate.ddl-auto=$FLAG_DDL_MODE -cp app:app/lib/* io.spotnext.whatsnear.Init --core.setup.typesystem.initialize=true --core.setup.import.sampledata=true"

echo "Command line: $COMMAND_LINE"

eval $COMMAND_LINE