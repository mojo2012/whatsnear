FROM adoptopenjdk/openjdk15-openj9:alpine

# for regular debian-based image
#RUN apt-get update && apt-get install --no-install-recommends -y inetutils-ping bsdmainutils && rm -rf /var/lib/apt/lists/*

# for alpine-based image
RUN apk add --update --no-cache \
	bash \
	util-linux \
	&& rm -rf /var/cache/apk/*

ENV SPRING_PROFILES_ACTIVE=""
ENV PRINT_ENV="false"
ENV ADDITIONAL_JAVA_ARG="\
    -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=8000 \
	-XXcompactRatio:50 \
	-XX:+IgnoreUnrecognizedVMOptions \
	-XX:+IdleTuningGcOnIdle \
	-XX:-ShrinkHeapInSteps \
	-XX:+UnlockExperimentalVMOptions \
	-XX:+UseShenandoahGC \
	-Xms10m -Xmx250m \  
	-XX:ShenandoahUncommitDelay=1000 \
	-XX:ShenandoahGuaranteedGCInterval=10000"

ARG DEPENDENCY=target/dependency

COPY ${DEPENDENCY}/BOOT-INF/lib        /app/lib
COPY ${DEPENDENCY}/META-INF            /app/META-INF
COPY ${DEPENDENCY}/BOOT-INF/classes    /app/
COPY docker/*                          /app/

RUN chmod +x /app/docker_entrypoint.sh

ENTRYPOINT [ "/app/docker_entrypoint.sh" ]
