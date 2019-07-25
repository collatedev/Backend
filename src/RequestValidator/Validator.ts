import IValidator from "./IValidator";
import IValidationResult from "./ValidationResult/IValidationResult";
import IValidationSchema from "./ValidationSchema/IValidationSchema";
import IRequest from "./Request/IRequest";
import ValidationResult from "./ValidationResult/ValidationResult";
import IRequestMapping from "./Request/IRequestMapping";
import ITypeConfiguration from "./ValidationSchema/ITypeConfiguration";
import IFieldConfiguration from "./ValidationSchema/IFieldConfiguration";
import PropertyPathComponent from "./PathBuilder/PropertyPathComponent";
import IPathBuilder from "./PathBuilder/IPathBuilder";
import PathBuilder from "./PathBuilder/PathBuilder";
import IErrorHandler from "./ErrorHandler/IErrorHandler";
import ValidatorErrorHandler from "./ErrorHandler/ValidatorErrorHandler";
import ErrorType from "./ErrorHandler/ErrorType";
import ISanitizer from "./Sanitizer/ISanitizer";
import Santizer from "./Sanitizer/Sanitizer";
import ITypeChecker from "./Types/ITypeChecker";
import TypeChecker from "./Types/TypeChecker";
import IsType from "./Types/IsType";
import RequestMapping from "./Request/RequestMapping";
import ValidationSchema from "./ValidationSchema/ValidationSchema";

const RootType : string = "request";

export default class Validator implements IValidator {
	private schema : IValidationSchema;
	private errorHandler : IErrorHandler;
	private pathBuilder : IPathBuilder;
	private sanitizer : ISanitizer;
	private typeChecker : ITypeChecker;
	private result : IValidationResult;

	constructor() {
		this.schema = new ValidationSchema({ types : {}});
		this.pathBuilder = new PathBuilder();
		this.sanitizer = new Santizer(this.pathBuilder, this.schema);
		this.typeChecker = new TypeChecker(this.pathBuilder, this.schema);
		this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
		this.result = new ValidationResult(this.errorHandler);
	}

	public validate(request : IRequest, schema : IValidationSchema) : IValidationResult {
		this.schema = schema;
		this.pathBuilder = new PathBuilder();
		this.sanitizer = new Santizer(this.pathBuilder, this.schema);
		this.typeChecker = new TypeChecker(this.pathBuilder, this.schema);
		this.errorHandler = new ValidatorErrorHandler(this.pathBuilder);
		this.result = new ValidationResult(this.errorHandler);

		this.validateRequestStructure(RootType, request.getRequest());

		if (this.schema.hasType(RootType)) {
			this.typeCheckAndSanitizeRequest(request);
		}		

		return this.result;
	}

	private typeCheckAndSanitizeRequest(request : IRequest) : void {
		const rootConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(RootType);
		for (const field of rootConfiguration.getFields()) {
			if (this.schema.hasType(field)) {
				const value : any = request.getRequest().value(field);
				const configuration : ITypeConfiguration = this.schema.getTypeConfiguration(field);
				this.pathBuilder.addPathComponent(new PropertyPathComponent(field));
				this.result.join(this.typeChecker.typeCheck(value, configuration));
				this.result.join(this.sanitizer.sanitize(value, configuration));
				this.pathBuilder.popComponent();
			} else {
				const value : any = request.toJson();
				this.result.join(this.typeChecker.typeCheck(value, rootConfiguration));
				this.result.join(this.sanitizer.sanitize(value, rootConfiguration));
			}
		}
	}

	private validateRequestStructure(typeName : string, mapping : IRequestMapping) : void {
		if (this.schema.hasType(typeName)) {
			const typeConfiguration : ITypeConfiguration = this.schema.getTypeConfiguration(typeName);
			this.checkForMissingProperties(mapping, typeConfiguration);
			this.checkForExtraProperties(mapping, typeConfiguration);
			this.validateField(mapping, typeConfiguration);
		} else {
			this.errorHandler.handleError([typeName], ErrorType.UnknownType);
		}
	}

	private checkForMissingProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
		for (const field of type.getFields()) {
			const fieldConfiguration : IFieldConfiguration = type.getConfiguration(field);
			// Adds an error if and only if the mapping is missing a field and that the missing field is required
			if (!mapping.has(field) && fieldConfiguration.required) {
				this.errorHandler.handleError([field], ErrorType.MissingField);
			}
		}   
	}

	private checkForExtraProperties(mapping : IRequestMapping, type : ITypeConfiguration) : void {
		for (const field of mapping.keys()) {
			if (!type.hasField(field)) {
				this.errorHandler.handleError([field], ErrorType.UnexpectedField);
			}
		}
	}

	private validateField(mapping : IRequestMapping, typeConfiguration : ITypeConfiguration) : void {
		for (const fieldName of typeConfiguration.getFields()) {
			if (typeConfiguration.hasField(fieldName) && mapping.has(fieldName)) {
				const configuration : IFieldConfiguration = typeConfiguration.getConfiguration(fieldName);
				const value : any = mapping.value(fieldName);
				this.pathBuilder.addPathComponent(new PropertyPathComponent(fieldName));

				if (this.schema.hasType(configuration.type) && IsType.isNestedObject(value)) {
					this.validateRequestStructure(configuration.type, new RequestMapping(value));
				}

				this.pathBuilder.popComponent();
			}
		}
	}
}