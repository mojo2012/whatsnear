package io.spotnext.whatsnear.rest.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import io.spotnext.core.infrastructure.annotation.logging.Log;
import io.spotnext.core.infrastructure.http.DataResponse;
import io.spotnext.core.infrastructure.http.HttpResponse;
import io.spotnext.core.infrastructure.support.LogLevel;
import io.spotnext.core.infrastructure.support.Logger;
import io.spotnext.core.infrastructure.support.MimeType;
import io.spotnext.core.management.annotation.Handler;
import io.spotnext.core.management.annotation.RemoteEndpoint;
import io.spotnext.core.management.service.impl.AbstractRestEndpoint;
import io.spotnext.core.management.support.BasicAuthenticationFilter;
import io.spotnext.core.management.transformer.JsonResponseTransformer;
import io.spotnext.whatsnear.beans.PointOfInterestQueryData;
import io.spotnext.whatsnear.services.PointOfInterestService;
import spark.Request;
import spark.Response;
import spark.route.HttpMethod;

@RemoteEndpoint(portConfigKey = "service.typesystem.rest.port", port = 19000, pathMapping = "/v1/poi", authenticationFilter = BasicAuthenticationFilter.class)
public class PointOfInterestEndpoint extends AbstractRestEndpoint {

	@Autowired
	private PointOfInterestService pointOfInterestService;
	
	@Log(logLevel = LogLevel.DEBUG, measureExecutionTime = true)
	@Handler(method = HttpMethod.get, pathMapping = { "/:location" }, mimeType = MimeType.JSON, responseTransformer = JsonResponseTransformer.class)
	public HttpResponse getPropertyWithPrefix(final Request request, final Response response) {
		
		var locationParam = request.params(":location");
		Logger.warn(locationParam);
		
		var typeQuery = request.queryParams("type");
		var textSearch = request.queryParams("textSearch");
		var maxDistance = request.queryParams("maxDistance");
		
		var query = new PointOfInterestQueryData();
		query.setLocation(locationParam);
		query.setType(typeQuery);
		query.setTextSearch(textSearch);
		query.setMaxDistance(maxDistance);
		
		var listings = pointOfInterestService.findAllNear(query);
		
		return DataResponse.ok().withPayload(listings);
	}

}
