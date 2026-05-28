import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/auth/current-user.decorator';
import type { AuthUser } from '../common/auth/auth-user';
import { DomainException } from '../common/errors/domain.exception';
import { ErrorCode } from '../common/errors/error-codes';
import { parseCursorPaginationQuery } from '../common/pagination/cursor-pagination';
import { SupabaseAdminService } from '../common/supabase/supabase-admin.service';
import {
  BookingListResponseDto,
  BookingResponseDto,
} from './dto/booking-response.dto';
import { parseCreateBookingBody } from './dto/create-booking-request.dto';
import { parseUpdateBookingBody } from './dto/update-booking-request.dto';
import { bookingNotFound, parseUuidField } from './dto/booking-fields';

const BOOKINGS_DEFAULT_LIMIT = 20;
const BOOKINGS_MAX_LIMIT = 50;

/**
 * Bloco 4G: Bookings API do tutor autenticado.
 * Fase 1 — apenas o ciclo de vida da reserva; nenhum pagamento é processado
 * e nenhuma proteção financeira é prometida (design.md §11 "Payments").
 */
@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly admin: SupabaseAdminService) {}

  @Get()
  @ApiOkResponse({ type: BookingListResponseDto })
  async list(
    @CurrentUser() user: AuthUser,
    @Query() query: unknown,
  ): Promise<BookingListResponseDto> {
    const pagination = parseCursorPaginationQuery(query, {
      defaultLimit: BOOKINGS_DEFAULT_LIMIT,
      maxLimit: BOOKINGS_MAX_LIMIT,
    });
    if (!user.profiles?.tutor && !user.profiles?.provider) {
      return { items: [], nextCursor: null };
    }
    const page = await this.admin.listBookingsForUser(user, pagination);
    return BookingListResponseDto.fromRecords(page.items, page.nextCursor);
  }

  @Post()
  @ApiOkResponse({ type: BookingResponseDto })
  async create(
    @CurrentUser() user: AuthUser,
    @Body() body: unknown,
  ): Promise<BookingResponseDto> {
    const tutorProfileId = requireTutorProfile(user);
    const input = parseCreateBookingBody(body);
    const booking = await this.admin.createBooking(tutorProfileId, input);
    return BookingResponseDto.fromRecord(booking);
  }

  @Patch(':id')
  @ApiOkResponse({ type: BookingResponseDto })
  async update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<BookingResponseDto> {
    const bookingId = parseUuidField(id, 'booking id');
    const input = parseUpdateBookingBody(body);
    const booking = await this.admin.updateBookingStatus(
      user,
      bookingId,
      input.status,
    );
    if (!booking) throw bookingNotFound();
    return BookingResponseDto.fromRecord(booking);
  }
}

/** Reservas exigem um `tutor_profile`, garantido no bootstrap do usuario tutor. */
function requireTutorProfile(user: AuthUser): string {
  const tutorProfileId = user.profiles?.tutor?.id;
  if (!tutorProfileId) {
    throw new DomainException(
      ErrorCode.NOT_FOUND,
      'Authenticated user has no tutor profile.',
      {},
      HttpStatus.NOT_FOUND,
    );
  }
  return tutorProfileId;
}
