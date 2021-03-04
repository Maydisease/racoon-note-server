import {Module} from '@nestjs/common';
import {NoteModule} from './note/note.module';
import {LinksModule} from './links/links.module';

@Module({
	imports: [
		NoteModule,
		LinksModule
	]
})

export class FrontendModule {
}
