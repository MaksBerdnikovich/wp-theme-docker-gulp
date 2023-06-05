export COMPOSE_PROJECT_NAME=$(basename $(dirname $(pwd)))

export COMPOSE_SYS_PROJECT_NAME=`echo "$COMPOSE_PROJECT_NAME" | sed "s/[^-_0-9a-z]//g"`

mkdir -p ../html

export PORTOFFSET="0"

for ARGUMENT in "$@"
do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)

    case "$KEY" in
            PORTOFFSET)   export PORTOFFSET=${VALUE} ;;
            *)
    esac
done

export NGINX_PORT=$((8000+$PORTOFFSET))

