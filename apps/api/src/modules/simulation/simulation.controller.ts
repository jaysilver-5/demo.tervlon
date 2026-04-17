import { Controller, Get, Param } from '@nestjs/common';
import { SimulationService } from './simulation.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('simulations')
export class SimulationController {
  constructor(private simulationService: SimulationService) {}

  @Public()
  @Get()
  async findAll() {
    return this.simulationService.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.simulationService.findById(id);
  }
}