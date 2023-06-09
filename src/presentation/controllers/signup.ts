import { MissingParamError } from '../errors/missing-param-errors';
import { badRequest } from '../helpers/http-helper';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { Controller } from '../protocols/controller';
import { EmailValidator } from '../protocols/email-validator';
import { InvalidParamError } from '../errors/invalid-param-error';

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor(emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    const requireFields = ['name', 'email', 'password', 'passwordConfirmation'];

    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email);

    if (!isValid) {
      return badRequest(new InvalidParamError('email'));
    }
    return {
      statusCode: 500,
      body: badRequest(new MissingParamError('any')),
    };
  }
}
