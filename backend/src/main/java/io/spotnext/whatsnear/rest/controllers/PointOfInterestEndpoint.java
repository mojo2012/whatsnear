package io.spotnext.whatsnear.rest.controllers;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import io.spotnext.core.infrastructure.annotation.logging.Log;
import io.spotnext.core.infrastructure.http.DataResponse;
import io.spotnext.core.infrastructure.http.HttpResponse;
import io.spotnext.core.infrastructure.service.SerializationService;
import io.spotnext.core.infrastructure.support.LogLevel;
import io.spotnext.core.infrastructure.support.MimeType;
import io.spotnext.core.management.annotation.Handler;
import io.spotnext.core.management.annotation.RemoteEndpoint;
import io.spotnext.core.management.service.impl.AbstractRestEndpoint;
import io.spotnext.core.management.support.NoAuthenticationFilter;
import io.spotnext.core.management.transformer.JsonResponseTransformer;
import io.spotnext.itemtype.core.beans.SerializationConfiguration;
import io.spotnext.itemtype.core.enumeration.DataFormat;
import io.spotnext.whatsnear.beans.PointOfInterestData;
import io.spotnext.whatsnear.beans.PointOfInterestQueryData;
import io.spotnext.whatsnear.rest.filters.CustomAuthenticationFilter;
import io.spotnext.whatsnear.services.PointOfInterestService;
import spark.Request;
import spark.Response;
import spark.route.HttpMethod;

@RemoteEndpoint(portConfigKey = "service.typesystem.rest.port", port = 19000, pathMapping = "/v1/poi", authenticationFilter = NoAuthenticationFilter.class)
public class PointOfInterestEndpoint extends AbstractRestEndpoint {

	private static final SerializationConfiguration CONFIG = new SerializationConfiguration();
	static {
		CONFIG.setFormat(DataFormat.JSON);
	}
	
	@Autowired
	private PointOfInterestService pointOfInterestService;
	
	@Autowired
	private SerializationService serializationService;
	
	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.get, pathMapping = { "", "/", "/:location" }, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class, authenticationFilter = NoAuthenticationFilter.class)
	public HttpResponse getPointOfInterests(final Request request, final Response response) {
		
		var locationParam = request.params(":location");
		var typeQuery = request.queryParams("type");
		var textSearch = request.queryParams("textSearch");
		var maxDistance = request.queryParams("maxDistance");
		
		var query = new PointOfInterestQueryData();
		query.setLocation(locationParam);
		query.setType(typeQuery);
		query.setTextSearch(textSearch);
		if (StringUtils.isNotBlank(maxDistance)) {
			query.setMaxDistance(maxDistance);
		}
		
		var listings = pointOfInterestService.findAllNear(query);
		
		return DataResponse.ok().withPayload(listings);
	}
	
	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.post, pathMapping = { "", "/"}, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class, authenticationFilter = CustomAuthenticationFilter.class)
	public HttpResponse postPointOfInterest(final Request request, final Response response) {
		
		var data = serializationService.deserialize(CONFIG, request.body(), PointOfInterestData.class);
		
		var poi = pointOfInterestService.save(data);
		
		return DataResponse.ok().withPayload(poi);
	}

}
